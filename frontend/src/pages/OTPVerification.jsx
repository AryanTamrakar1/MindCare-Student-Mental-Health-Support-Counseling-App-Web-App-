import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email; 

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/verify-otp', { email, otp });
      alert("Verification Successful! Your account is now active.");
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP code. Please try again.");
    }
  };

  //Resend Logic
  const handleResendCode = async () => {
    try {
      await API.post('/auth/resend-otp', { email });
      alert("A new code has been generated! Check your terminal.");
    } catch (err) {
      alert("Error resending code. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-gray-100">
        
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Check your Code</h2>
        <p className="text-gray-400 font-medium mb-8">
          We've generated a code for <br/>
          <span className="text-indigo-600 font-bold">{email}</span>
        </p>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="text" 
            maxLength="4"
            placeholder="0 0 0 0"
            className="w-full text-center text-4xl tracking-[1rem] font-black p-5 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none transition-all"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            Verify Account
          </button>
        </form>

        {/* --- RESEND BUTTON --- */}
        <div className="mt-6 text-sm">
          <p className="text-gray-400 font-medium">
            Didn't receive a code? 
            <button 
              onClick={handleResendCode}
              className="ml-1 text-indigo-600 font-bold hover:underline"
            >
              Resend Code
            </button>
          </p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-6 text-sm font-bold text-gray-400 hover:text-gray-600"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;