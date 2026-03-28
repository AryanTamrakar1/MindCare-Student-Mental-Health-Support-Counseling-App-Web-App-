import React from "react";
import { OTPVerificationProvider } from "../context/otpVerification/OTPVerificationContext";
import { useOTPVerification } from "../hooks/otpVerification/useOTPVerification";

const OTPVerificationInner = () => {
  const { otp, setOtp, email, handleVerify, handleResendCode, handleCancel } = useOTPVerification();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-white p-10 shadow-2xl max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Check your Code
        </h2>
        <p className="text-gray-400 font-medium mb-8">
          The code is generated for <br />
          <span className="text-blue-600 font-bold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength="4"
            placeholder="0 0 0 0"
            className="w-full text-center text-4xl tracking-[1rem] font-black p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            Verify Account
          </button>
        </form>

        <div className="mt-6 text-sm">
          <p className="text-gray-400 font-medium">
            Didn't receive a code?
            <button
              onClick={handleResendCode}
              className="ml-1 text-blue-600 font-bold hover:underline"
            >
              Resend Code
            </button>
          </p>
        </div>

        <button
          onClick={handleCancel}
          className="mt-6 text-sm font-bold text-gray-400 hover:text-gray-600"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
};

const OTPVerification = () => {
  return (
    <OTPVerificationProvider>
      <OTPVerificationInner />
    </OTPVerificationProvider>
  );
};

export default OTPVerification;