const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    // --- Basic Information ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    // --- Access Control ---
    role: {
      type: String,
      enum: ["Admin", "Student", "Counselor", "Pending_Selection"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // --- Student ---
    studentId: { type: String },
    phone: { type: String },
    dob: { type: String },
    gender: { type: String },

    // --- Counselor  ---
    profTitle: { type: String },
    qualifications: { type: String },
    experience: { type: String },
    specialization: { type: String },
    licenseNo: { type: String },
    bio: { type: String },

    availability: [
      {
        date: { type: String }, 
        formattedDate: { type: String }, 
        day: { type: String }, 
        timeSlot: { type: String },
      },
    ],

    // --- Verification System ---
    otp: { type: String },
    verificationPhoto: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
