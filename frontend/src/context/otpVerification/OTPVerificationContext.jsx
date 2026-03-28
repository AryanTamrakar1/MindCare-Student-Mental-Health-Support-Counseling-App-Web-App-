import { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; 
import API from "../../api/axios";

const OTPVerificationContext = createContext(null);

export const OTPVerificationProvider = ({ children }) => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  let email = "";
  if (location.state && location.state.email) {
    email = location.state.email;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify-otp", { email, otp }); 
      alert("Verification Successful!");
      login(res.data.user, res.data.token); 
      navigate("/student-dashboard");   
    } catch (err) {
      let message = "Invalid OTP code. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const handleResendCode = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      alert("A new code has been sent to your email!"); // ✅ fixed message
    } catch (err) {
      alert("Error resending code. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/Login");
  };

  return (
    <OTPVerificationContext.Provider
      value={{
        otp,
        setOtp,
        email,
        handleVerify,
        handleResendCode,
        handleCancel,
      }}
    >
      {children}
    </OTPVerificationContext.Provider>
  );
};

export const useOTPVerificationContext = () => {
  const ctx = useContext(OTPVerificationContext);
  if (!ctx)
    throw new Error(
      "useOTPVerificationContext must be used inside OTPVerificationProvider"
    );
  return ctx;
};