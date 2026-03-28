import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";

const StudentRegisterContext = createContext(null);

export const StudentRegisterProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleData, setGoogleData] = useState(null);

  useEffect(function () {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(function () {
    if (location.state && location.state.googleData) {
      setGoogleData(location.state.googleData);
      setEmail(location.state.googleData.email);
      setName(location.state.googleData.name);
    }
  }, [location.state]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!photo) {
      return alert("Please upload your ID photo for verification.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("role", "Student");
    data.append("studentId", studentId);
    data.append("phone", phone);
    data.append("dob", dob);
    data.append("gender", gender);
    data.append("verificationPhoto", photo);

    try {
      await API.post("/auth/register", data);
      alert("Registration Successful! Please verify your OTP.");
      navigate("/verify-otp", { state: { email: email } });
    } catch (err) {
      let message = "Error registering student";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const goToLogin = () => {
    navigate("/Login");
  };

  return (
    <StudentRegisterContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        studentId,
        setStudentId,
        phone,
        setPhone,
        dob,
        setDob,
        gender,
        setGender,
        photo,
        setPhoto,
        confirmPassword,
        setConfirmPassword,
        googleData,
        handleRegister,
        goToLogin,
      }}
    >
      {children}
    </StudentRegisterContext.Provider>
  );
};

export const useStudentRegisterContext = () => {
  const ctx = useContext(StudentRegisterContext);
  if (!ctx)
    throw new Error("useStudentRegisterContext must be used inside StudentRegisterProvider");
  return ctx;
};