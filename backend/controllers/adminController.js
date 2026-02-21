const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Get only counselors who are "Pending" 
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ 
            role: 'Counselor', 
            status: 'Pending' 
        });
        res.json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get ALL Users (Students and Counselors)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Delete a User
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// It allows the admin to reset a rejected counselor back to Pending and sends an email notification to the counselor about the reset. 
const resetToPending = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = "Pending";
        await user.save();
        sendEmail(
            user.email,
            "Your Account is Being Reviewed Again",
            `Hello ${user.name},\n\nGood news! Your account has been reset and is now pending review again by our admin team. You will receive another email once a decision has been made.\n\nThank you for your patience.`
        ).catch((err) => console.error("Reset Email Error:", err));

        res.json({ message: "Account reset to Pending and counselor notified." });
    } catch (error) {
        res.status(500).json({ message: "Error resetting account status" });
    }
};

module.exports = { getPendingUsers, getAllUsers, deleteUser, resetToPending };