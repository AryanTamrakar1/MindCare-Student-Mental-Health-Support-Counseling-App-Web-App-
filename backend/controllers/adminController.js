const User = require('../models/User');

// This function provides the list for the Admin Dashboard table
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

module.exports = { getPendingUsers };