const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleLogin, 
  updateRole, 
  verifyOTP, 
  resendOTP, 
  updateProfile
} = require('../controllers/authController');

const upload = require('./uploadMiddleware');

router.post('/register', upload.single('verificationPhoto'), registerUser);

router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.put('/update-role', updateRole);
router.put('/update-profile', updateProfile);

router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;