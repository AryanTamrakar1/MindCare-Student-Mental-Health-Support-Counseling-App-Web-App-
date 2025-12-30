const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail");

// --- Register ---
const registerUser = async (req, res) => {
  const { name, email, password, role, ...otherFields } = req.body;

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
      name,
      email,
      password: hashedPassword,
      role,
      status,
      otp,
      verificationPhoto,
      ...otherFields,
    });

    if (role === "Student") {
      sendEmail(
        user.email,
        "Verify Your Student Account",
        `Hello ${user.name},\n\nYour verification code is: ${otp}`
      ).catch(err => console.error("Registration Email Error:", err));
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
    const user = await User.findOneAndUpdate(
      { email },
      { otp: newOtp },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    sendEmail(
      user.email,
      "New Verification Code",
      `Your new code is: ${newOtp}`
    ).catch(err => console.error("Resend OTP Error:", err));

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
          ? "Your account is Pending Admin approval or OTP verification."
          : "Your application has been Rejected. Please contact support.";
      return res.status(403).json({ message: blockMsg });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      message: "Login successful!",
      token,
      user: {
        name: user.name,
        role: user.role,
        status: user.status,
        email: user.email,
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
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        role: "Pending_Selection",
        status: "Approved",
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token: jwtToken,
      user: {
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
  const { email, role, ...otherFields } = req.body;
  try {
    const status = role === "Counselor" ? "Pending" : "Approved";
    const updateData = { role, status, ...otherFields };
    if (req.file) {
      updateData.verificationPhoto = req.file.filename;
    }

    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
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

    const subject = status === "Approved" ? "Application Approved!" : "Application Rejected";
    const emailBody = status === "Approved"
        ? `Congratulations ${user.name}! Your account has been approved. You can now login.`
        : `Hello ${user.name}, we regret to inform you that your application was not approved.`;

    sendEmail(user.email, subject, emailBody).catch(err => console.error("Admin Action Email Error:", err));

    res.json({ message: `Account has been ${status} and user notified.` });
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
  manageUserStatus,
};