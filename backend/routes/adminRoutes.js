const express = require('express');
const router = express.Router();
// Import the logic from controllers
const { manageUserStatus } = require('../controllers/authController');
const { getPendingUsers } = require('../controllers/adminController');

// Get the list of pending counselors
router.get('/pending', getPendingUsers);

// Handle the Approve/Reject 
router.put('/update-status', manageUserStatus);

module.exports = router;
