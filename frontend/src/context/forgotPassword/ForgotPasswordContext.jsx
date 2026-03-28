import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const ForgotPasswordContext = createContext(null);

export const ForgotPasswordProvider = ({ children }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      let message = "Error sending reset link";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setSubmitted(false);
  };

  const handleBackToLogin = () => {
    navigate("/Login");
  };

  return (
    <ForgotPasswordContext.Provider
      value={{
        email,
        setEmail,
        loading,
        submitted,
        handleSubmit,
        handleBackToForm,
        handleBackToLogin,
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPasswordContext = () => {
  const ctx = useContext(ForgotPasswordContext);
  if (!ctx)
    throw new Error(
      "useForgotPasswordContext must be used inside ForgotPasswordProvider"
    );
  return ctx;
};