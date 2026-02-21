const express = require('express');
const router = express.Router();
const { manageUserStatus } = require('../controllers/authController');
const { getPendingUsers, getAllUsers, deleteUser, resetToPending } = require('../controllers/adminController');

router.get('/pending', getPendingUsers);
router.put('/update-status', manageUserStatus);

// Routes for User Management
router.get('/all-users', getAllUsers);
router.delete('/delete-user/:id', deleteUser);

// Admin resets a rejected counselor back to Pending
router.put('/reset-to-pending/:id', resetToPending);

module.exports = router;