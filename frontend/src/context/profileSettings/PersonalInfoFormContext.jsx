import { createContext, useContext, useState } from "react";
import API from "../../api/axios";
import { useProfileSettingsContext } from "./ProfileSettingsContext";

const PersonalInfoFormContext = createContext(null);

export const PersonalInfoFormProvider = ({ children }) => {
  const { currentUser, setCurrentUser, updateUser } = useProfileSettingsContext();

  const [name, setName] = useState(currentUser && currentUser.name ? currentUser.name : "");
  const [phone, setPhone] = useState(currentUser && currentUser.phone ? currentUser.phone : "");
  const [gender, setGender] = useState(currentUser && currentUser.gender ? currentUser.gender : "");
  const [studentId, setStudentId] = useState(currentUser && currentUser.studentId ? currentUser.studentId : "");
  const [licenseNo, setLicenseNo] = useState(currentUser && currentUser.licenseNo ? currentUser.licenseNo : "");

  const handleSaveName = async () => {
    const confirmed = window.confirm("Are you sure you want to save these changes?");
    if (!confirmed) return;
    try {
      const updateData = {
        userId: currentUser._id,
        name,
        phone,
        gender,
        studentId,
        licenseNo,
      };
      const res = await API.put("/auth/update-profile", updateData);
      setCurrentUser({
        ...currentUser,
        name: res.data.user.name,
        phone: res.data.user.phone,
        gender: res.data.user.gender,
        studentId: res.data.user.studentId,
        licenseNo: res.data.user.licenseNo,
      });
      updateUser({
        name: res.data.user.name,
        phone: res.data.user.phone,
        gender: res.data.user.gender,
        studentId: res.data.user.studentId,
        licenseNo: res.data.user.licenseNo,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      let message = "Update failed";
      if (err && err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  return (
    <PersonalInfoFormContext.Provider
      value={{
        name,
        setName,
        phone,
        setPhone,
        gender,
        setGender,
        studentId,
        setStudentId,
        licenseNo,
        setLicenseNo,
        handleSaveName,
      }}
    >
      {children}
    </PersonalInfoFormContext.Provider>
  );
};

export const usePersonalInfoFormContext = () => {
  const ctx = useContext(PersonalInfoFormContext);
  if (!ctx)
    throw new Error(
      "usePersonalInfoFormContext must be used inside PersonalInfoFormProvider"
    );
  return ctx;
};