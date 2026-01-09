const User = require('../models/User');

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

//Get ALL Users (Students and Counselors)
const getAllUsers = async (req, res) => {
    try {
        // Find everyone except Admin
        const users = await User.find({ role: { $ne: 'Admin' } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

//Delete a User
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

module.exports = { getPendingUsers, getAllUsers, deleteUser };