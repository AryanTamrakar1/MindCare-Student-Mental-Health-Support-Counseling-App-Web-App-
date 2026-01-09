const express = require('express');
const router = express.Router();
const { manageUserStatus } = require('../controllers/authController');
const { getPendingUsers, getAllUsers, deleteUser } = require('../controllers/adminController');

router.get('/pending', getPendingUsers);
router.put('/update-status', manageUserStatus);

// Routes for User Management
router.get('/all-users', getAllUsers); // This gets the list of all users
router.delete('/delete-user/:id', deleteUser); // This deletes a user

module.exports = router;