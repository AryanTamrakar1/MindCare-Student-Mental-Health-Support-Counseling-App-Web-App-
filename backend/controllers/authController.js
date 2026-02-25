const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail");
const { createNotification } = require("./notificationController");

// --- Register ---
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let status = "Pending";
    let otp = null;
    let verificationPhoto = req.file ? req.file.filename : null;

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

// --- Verify OTP ---
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp === otp) {
      user.status = "Approved";
      user.otp = null;
      await user.save();
      res.json({
        message: "OTP Verified! You can now login.",
        status: user.status,
      });
    } else {
      res.status(400).json({ message: "Invalid OTP code" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Resend OTP ---
const resendOTP = async (req, res) => {
  const { email } = req.body;
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

// --- Login ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        email: user.email,
        verificationPhoto: user.verificationPhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Google Login ---
const googleLogin = async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Pending_Selection",
        status: "Approved",
        verificationPhoto: null,
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid Google Token" });
  }
};

// --- Update Role ---
const updateRole = async (req, res) => {
  const { email, role } = req.body;
  try {
    const status = role === "Counselor" ? "Pending" : "Approved";
    const updateData = {
      role: role,
      status: status,
      profTitle: req.body.profTitle,
      specialization: req.body.specialization,
      bio: req.body.bio,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      availability: req.body.availability,
    };

    if (req.file) {
      updateData.verificationPhoto = req.file.filename;
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = updateData.role;
    user.status = updateData.status;
    if (updateData.profTitle) user.profTitle = updateData.profTitle;
    if (updateData.specialization)
      user.specialization = updateData.specialization;
    if (updateData.bio) user.bio = updateData.bio;
    if (updateData.qualifications)
      user.qualifications = updateData.qualifications;
    if (updateData.experience) user.experience = updateData.experience;
    if (updateData.availability) user.availability = updateData.availability;
    if (updateData.verificationPhoto)
      user.verificationPhoto = updateData.verificationPhoto;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Update Profile ---
const updateProfile = async (req, res) => {
  const { userId, name, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({
      message: "Profile updated successfully!",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Update Profile Photo ---
const updateProfilePhoto = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }
    user.verificationPhoto = req.file.filename;
    await user.save();

    res.json({
      message: "Profile photo updated successfully!",
      verificationPhoto: user.verificationPhoto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Admin Manage Status ---
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

    res.json({ message: `Account has been ${status} and user notified.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Middleware to protect routes ---
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

// --- Get the Counselors ---
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

// --- Search and Filter Counselors ---
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

// --- Edit Counselor Profile ---
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
};
