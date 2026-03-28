import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleRedirect = (user) => {
    if (user.role === "Admin") {
      navigate("/admin-dashboard");
    } else if (user.role === "Student") {
      navigate("/student-dashboard");
    } else if (user.role === "Counselor") {
      navigate("/counselor-dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const userData = res.data.user;
      login(userData, res.data.token);
      alert("Login Successful!");
      handleRedirect(userData);
    } catch (err) {
      let message = "Login failed";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      if (res.data.isNewUser) {
        navigate("/role-selection", {
          state: { googleData: res.data.googleData },
        });
      } else {
        login(res.data.user, res.data.token);
        handleRedirect(res.data.user);
      }
    } catch (err) {
      let message = "Google Login Error";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const handleRegisterClick = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <LoginContext.Provider
      value={{
        showModal,
        setShowModal,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        handleGoogleLogin,
        handleRegisterClick,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const ctx = useContext(LoginContext);
  if (!ctx)
    throw new Error("useLoginContext must be used inside LoginProvider");
  return ctx;
};