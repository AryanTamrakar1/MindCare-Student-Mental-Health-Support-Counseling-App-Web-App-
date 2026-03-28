import { createContext, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";

const CounselorRegisterContext = createContext(null);

export const CounselorRegisterProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  let googleUser = null;
  if (location.state && location.state.googleData) {
    googleUser = location.state.googleData;
  }

  let initialName = "";
  if (googleUser) initialName = googleUser.name;

  let initialEmail = "";
  if (googleUser) initialEmail = googleUser.email;

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("role", "Counselor");
    data.append("phone", phone);
    data.append("qualifications", qualifications);
    data.append("experience", experience);
    data.append("specialization", specialization);
    data.append("licenseNo", licenseNo);
    data.append("bio", bio);

    if (photo) {
      data.append("verificationPhoto", photo);
    }

    try {
      await API.post("/auth/register", data);
      alert("Application Submitted! Please wait for Admin approval.");
      navigate("/");
    } catch (err) {
      let message = "Error submitting application";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const handleBackToLogin = () => {
    navigate("/Login");
  };

  return (
    <CounselorRegisterContext.Provider
      value={{
        googleUser,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        phone,
        setPhone,
        qualifications,
        setQualifications,
        experience,
        setExperience,
        specialization,
        setSpecialization,
        licenseNo,
        setLicenseNo,
        bio,
        setBio,
        photo,
        setPhoto,
        confirmPassword,
        setConfirmPassword,
        handleRegister,
        handleBackToLogin,
      }}
    >
      {children}
    </CounselorRegisterContext.Provider>
  );
};

export const useCounselorRegisterContext = () => {
  const ctx = useContext(CounselorRegisterContext);
  if (!ctx)
    throw new Error(
      "useCounselorRegisterContext must be used inside CounselorRegisterProvider"
    );
  return ctx;
};