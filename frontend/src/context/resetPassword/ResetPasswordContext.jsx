import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const ResetPasswordContext = createContext(null);

export const ResetPasswordProvider = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(function () {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(function () {
    const verifyToken = async () => {
      try {
        await API.get("/auth/verify-reset-token/" + token);
        setVerifying(false);
      } catch (err) {
        let message = "Invalid or expired token";
        if (err && err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        }
        setError(message);
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      let message = "Error resetting password";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
    setLoading(false);
  };

  const handleRequestNewLink = () => {
    navigate("/forgot-password");
  };

  const handleGoToLogin = () => {
    navigate("/Login");
  };

  return (
    <ResetPasswordContext.Provider
      value={{
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirm,
        setShowConfirm,
        loading,
        verifying,
        error,
        success,
        handleSubmit,
        handleRequestNewLink,
        handleGoToLogin,
      }}
    >
      {children}
    </ResetPasswordContext.Provider>
  );
};

export const useResetPasswordContext = () => {
  const ctx = useContext(ResetPasswordContext);
  if (!ctx)
    throw new Error(
      "useResetPasswordContext must be used inside ResetPasswordProvider"
    );
  return ctx;
};