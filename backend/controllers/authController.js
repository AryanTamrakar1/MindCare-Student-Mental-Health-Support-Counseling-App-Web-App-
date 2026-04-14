const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail");
const { createNotification } = require("./notificationController");
const PasswordReset = require("../models/PasswordReset");
const crypto = require("crypto");
const MoodQuiz = require("../models/MoodQuiz");
const Notification = require("../models/Notification");
const { uploadToCloudinary } = require("../routes/uploadMiddleware");

// It normalizes an email address to a standard format
const normalizeEmail = (email) => {
  const [local, domain] = email.toLowerCase().trim().split("@");
  if (domain === "gmail.com") return local.replace(/\./g, "") + "@" + domain;
  return email.toLowerCase().trim();
};

// It gets the week label for a given date
function getWeekLabel(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const year = monday.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const msPerWeek = 604800000;
  const weekNumber = Math.ceil(
    (monday - new Date(jan4.getFullYear(), 0, 4)) / msPerWeek + 1,
  );
  return year + "-W" + String(weekNumber).padStart(2, "0");
}

// It sends a quiz notification if needed
async function sendQuizNotificationIfNeeded(userId) {
  const weekLabel = getWeekLabel(new Date());
  const alreadySubmitted = await MoodQuiz.findOne({
    student: userId,
    weekLabel,
  });
  if (alreadySubmitted) return;

  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const alreadyNotified = await Notification.findOne({
    userId: userId,
    type: "quiz_reminder",
    createdAt: { $gte: monday },
  });
  if (alreadyNotified) return;

  await createNotification(
    userId,
    "Weekly Mood Quiz is Ready!",
    "You haven't completed this week's mood quiz yet. Take a few minutes to check in with yourself.",
    "quiz_reminder",
    "/mood-quiz",
  );
}

// It registers a new user
const registerUser = async (req, res) => {
  const { name, password, role } = req.body;
  const email = normalizeEmail(req.body.email);

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let status = "Pending";
    let otp = null;
    let verificationPhoto = null;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
      );
      verificationPhoto = result.secure_url;
    }

    if (role === "Student") {
      otp = Math.floor(1000 + Math.random() * 9000).toString();
    }

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      status: status,
      otp: otp,
      verificationPhoto: verificationPhoto,
      studentId: req.body.studentId,
      phone: req.body.phone,
      dob: req.body.dob,
      gender: req.body.gender,
      licenseNo: req.body.licenseNo,
      profTitle: req.body.profTitle,
      specialization: req.body.specialization,
      bio: req.body.bio,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      availability: req.body.availability,
    });

    if (role === "Student") {
      sendEmail(
        user.email,
        "Verify Your Student Account",
        `Hello ${user.name},\n\nYour verification code is: ${otp}`,
      ).catch((err) => console.error("Registration Email Error:", err));
    }

    if (role === "Counselor") {
      const admins = await User.find({ role: "Admin" });
      for (let i = 0; i < admins.length; i++) {
        await createNotification(
          admins[i]._id,
          "New Counselor Application",
          user.name +
            " has applied to be a counselor. Please review their application.",
          "general",
          "/counselor-approvals",
        );
      }
    }

    res.status(201).json({
      message:
        role === "Student"
          ? "Registration successful! Please verify OTP."
          : "Application submitted! Please wait for Admin approval.",
      status: status,
      role: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It verifies the OTP and logs the student in
const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const email = normalizeEmail(req.body.email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp === otp) {
      user.status = "Approved";
      user.otp = null;
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      if (user.role === "Student") {
        await sendQuizNotificationIfNeeded(user._id);
      }

      res.json({
        message: "OTP Verified! Redirecting to dashboard...",
        token,
        user: {
          _id: user._id,
          name: user.name,
          role: user.role,
          status: user.status,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          gender: user.gender,
          studentId: user.studentId,
          licenseNo: user.licenseNo,
          verificationPhoto: user.verificationPhoto,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid OTP code" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It resends the OTP to the user's email
const resendOTP = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  try {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.otp = newOtp;
    await user.save();

    sendEmail(
      user.email,
      "New Verification Code",
      `Your new code is: ${newOtp}`,
    ).catch((err) => console.error("Resend OTP Error:", err));

    res.json({ message: "New OTP sent to your email!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It logs a user in
const loginUser = async (req, res) => {
  const { password } = req.body;
  const email = normalizeEmail(req.body.email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    if (user.status !== "Approved") {
      const blockMsg =
        user.status === "Pending"
          ? "Your account is pending Admin approval. You will receive an email once approved."
          : "Your application has been rejected. Please check your email for details or contact the admin.";
      return res.status(403).json({ message: blockMsg });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    if (user.role === "Student") {
      await sendQuizNotificationIfNeeded(user._id);
    }

    res.json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        studentId: user.studentId,
        licenseNo: user.licenseNo,
        verificationPhoto: user.verificationPhoto,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It logs in a user with a Google account
const googleLogin = async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = normalizeEmail(payload.email);
    const name = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
      res.json({
        isNewUser: true,
        googleData: {
          email: email,
          name: name,
        },
      });
    } else {
      user.lastLogin = new Date();
      await user.save();

      const jwtToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      if (user.role === "Student") {
        await sendQuizNotificationIfNeeded(user._id);
      }

      res.json({
        isNewUser: false,
        token: jwtToken,
        user: {
          _id: user._id,
          name: user.name,
          role: user.role,
          status: user.status,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          gender: user.gender,
          studentId: user.studentId,
          licenseNo: user.licenseNo,
          verificationPhoto: user.verificationPhoto,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid Google Token" });
  }
};

// It updates a user's role
const updateRole = async (req, res) => {
  const { role } = req.body;
  const email = normalizeEmail(req.body.email);
  try {
    const status = role === "Counselor" ? "Pending" : "Approved";
    const updateData = {
      role: role,
      status: status,
      studentId: req.body.studentId,
      phone: req.body.phone,
      dob: req.body.dob,
      gender: req.body.gender,
      licenseNo: req.body.licenseNo,
      profTitle: req.body.profTitle,
      specialization: req.body.specialization,
      bio: req.body.bio,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      availability: req.body.availability,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      updateData.verificationPhoto = result.secure_url;
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = updateData.role;
    user.status = updateData.status;
    if (updateData.studentId) user.studentId = updateData.studentId;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.dob) user.dob = updateData.dob;
    if (updateData.gender) user.gender = updateData.gender;
    if (updateData.licenseNo) user.licenseNo = updateData.licenseNo;
    if (updateData.profTitle) user.profTitle = updateData.profTitle;
    if (updateData.specialization) user.specialization = updateData.specialization;
    if (updateData.bio) user.bio = updateData.bio;
    if (updateData.qualifications) user.qualifications = updateData.qualifications;
    if (updateData.experience) user.experience = updateData.experience;
    if (updateData.availability) user.availability = updateData.availability;
    if (updateData.verificationPhoto) user.verificationPhoto = updateData.verificationPhoto;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It updates a user's profile
const updateProfile = async (req, res) => {
  const {
    userId,
    name,
    phone,
    gender,
    dob,
    studentId,
    licenseNo,
    currentPassword,
    newPassword,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (studentId) user.studentId = studentId;
    if (licenseNo) user.licenseNo = licenseNo;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({
      message: "Profile updated successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        studentId: user.studentId,
        licenseNo: user.licenseNo,
        role: user.role,
        status: user.status,
        verificationPhoto: user.verificationPhoto,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It updates a user's profile photo
const updateProfilePhoto = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    user.verificationPhoto = result.secure_url;
    await user.save();

    res.json({
      message: "Profile photo updated successfully!",
      verificationPhoto: user.verificationPhoto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It approves or rejects a counselor application and notifies the user
const manageUserStatus = async (req, res) => {
  const { userId, status } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    const subject =
      status === "Approved" ? "Application Approved!" : "Application Rejected";

    const emailBody =
      status === "Approved"
        ? `Congratulations ${user.name}!\n\nYour counselor account has been approved. You can now log in and access your dashboard.\n\nWelcome to the team!`
        : `Hello ${user.name},\n\nWe regret to inform you that your counselor application has not been approved at this time.\n\nIf you believe this was a mistake or would like to reapply, please contact our admin team.\n\nThank you for your understanding.`;

    sendEmail(user.email, subject, emailBody).catch((err) =>
      console.error("Admin Action Email Error:", err),
    );

    const notificationTitle =
      status === "Approved"
        ? "Application Approved! 🎉"
        : "Application Decision";

    const notificationMessage =
      status === "Approved"
        ? "Congratulations! Your counselor application has been approved. You can now log in and start offering sessions."
        : "Your counselor application was not approved at this time. You can reapply or contact admin for more information.";

    await createNotification(
      userId,
      notificationTitle,
      notificationMessage,
      status === "Approved" ? "booking_approved" : "general",
      status === "Approved" ? "/dashboard" : "/counselors",
    );

    res.json({ message: `Account has been ${status} and user notified.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It protects routes by verifying the JWT token
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const foundUser = await User.findById(decoded.id);
      foundUser.password = undefined;
      req.user = foundUser;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// It gets the counselors that are approved
const getCounselors = async (req, res) => {
  try {
    const counselors = await User.find({
      role: "Counselor",
      status: "Approved",
    });
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching counselors" });
  }
};

// It searches and filters counselors based on name and specialization
const searchCounselors = async (req, res) => {
  try {
    const { name, specialization } = req.query;
    const allCounselors = await User.find({
      role: "Counselor",
      status: "Approved",
    });

    let counselors = allCounselors;

    if (name) {
      const nameLower = name.toLowerCase();
      const filtered = [];
      for (let i = 0; i < counselors.length; i++) {
        if (
          counselors[i].name &&
          counselors[i].name.toLowerCase().includes(nameLower)
        ) {
          filtered.push(counselors[i]);
        }
      }
      counselors = filtered;
    }
    if (specialization) {
      const specLower = specialization.toLowerCase();
      const filtered = [];
      for (let i = 0; i < counselors.length; i++) {
        if (
          counselors[i].specialization &&
          counselors[i].specialization.toLowerCase().includes(specLower)
        ) {
          filtered.push(counselors[i]);
        }
      }
      counselors = filtered;
    }

    res.json(counselors);
  } catch (error) {
    res.status(500).json({ message: "Error searching counselors" });
  }
};

// It edits a counselor's profile
const editCounselorProfile = async (req, res) => {
  try {
    const counselorId = req.user.id;

    if (req.user.role !== "Counselor") {
      return res.status(403).json({
        message:
          "Access denied. Only counselors can update professional profiles.",
      });
    }

    const {
      profTitle,
      specialization,
      bio,
      qualifications,
      experience,
      availability,
    } = req.body;

    const updatedCounselor = await User.findById(counselorId);

    if (!updatedCounselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }

    updatedCounselor.profTitle = profTitle;
    updatedCounselor.specialization = specialization;
    updatedCounselor.bio = bio;
    updatedCounselor.qualifications = qualifications;
    updatedCounselor.experience = experience;
    updatedCounselor.availability = availability;

    await updatedCounselor.save();

    res.json({
      message: "Professional profile updated!",
      user: updatedCounselor,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating counselor profile" });
  }
};

// It sends a password reset link to the user's email
const forgotPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const email = normalizeEmail(req.body.email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await PasswordReset.deleteMany({ email });

    await PasswordReset.create({ email, token: resetToken, expiresAt });

    const resetLink = process.env.CLIENT_URL + "/reset-password/" + resetToken;

    await sendEmail(
      email,
      "Password Reset Request",
      `Hello ${user.name},\n\nClick the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
    );

    res.json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It resets the user's password using a valid reset token
const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const resetRecord = await PasswordReset.findOne({ token });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (resetRecord.expiresAt < new Date()) {
      await PasswordReset.deleteOne({ token });
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await User.findOne({ email: resetRecord.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await PasswordReset.deleteOne({ token });

    res.json({ message: "Password reset successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// It checks if a password reset token is valid and not expired
const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const resetRecord = await PasswordReset.findOne({ token });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (resetRecord.expiresAt < new Date()) {
      await PasswordReset.deleteOne({ token });
      return res.status(400).json({ message: "Token has expired" });
    }

    res.json({ message: "Token is valid", email: resetRecord.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  googleLogin,
  updateRole,
  updateProfile,
  updateProfilePhoto,
  manageUserStatus,
  protect,
  getCounselors,
  searchCounselors,
  editCounselorProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};