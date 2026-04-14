const express = require('express');
const router = express.Router();
const { manageUserStatus } = require('../controllers/authController');
const { getPendingUsers, getAllUsers, deleteUser, resetToPending } = require('../controllers/adminController');

router.get('/pending', getPendingUsers);
router.put('/update-status', manageUserStatus);
router.get('/all-users', getAllUsers);
router.delete('/delete-user/:id', deleteUser);
router.put('/reset-to-pending/:id', resetToPending);

module.exports = router;