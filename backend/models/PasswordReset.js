const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  // --- Email ---
  email: {
    type: String,
    required: true,
  },
  // --- Token ---
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // --- Expiry ---
  expiresAt: {
    type: Date,
    required: true,
  },
  // --- Created At ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema);