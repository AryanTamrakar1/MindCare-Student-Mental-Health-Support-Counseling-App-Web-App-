import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import API from "../../api/axios";

const ProfileSettingsContext = createContext(null);

export const ProfileSettingsProvider = ({ children }) => {
  const { user: contextUser, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(contextUser);
  const [loading, setLoading] = useState(false);

  useEffect(function () {
    if (contextUser) {
      setCurrentUser(contextUser);
      setLoading(false);
    } else {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setLoading(false);
      } else {
        navigate("/");
      }
    }
  }, [contextUser, navigate]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("verificationPhoto", file);
    formData.append("userId", currentUser._id);
    try {
      const res = await API.put("/auth/update-profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile photo updated successfully!");
      setCurrentUser({ ...currentUser, verificationPhoto: res.data.verificationPhoto });
      updateUser({ verificationPhoto: res.data.verificationPhoto });
    } catch (err) {
      let message = "Photo upload failed";
      if (err && err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    logout();
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (!confirmed) return;
    const doubleConfirm = window.confirm("This will erase all your data. Are you absolutely sure?");
    if (!doubleConfirm) return;
    try {
      await API.delete("/auth/delete-account", { data: { userId: currentUser._id } });
      alert("Your account has been deleted.");
      logout();
    } catch (err) {
      let message = "Failed to delete account";
      if (err && err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      alert(message);
    }
  };

  const getProfilePhotoUrl = () => {
    if (currentUser && currentUser.verificationPhoto) {
      return "http://127.0.0.1:5050/uploads/verifications/" + currentUser.verificationPhoto;
    }
    let userName = "User";
    if (currentUser && currentUser.name) {
      userName = currentUser.name;
    }
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName) + "&background=2563EB&color=fff&size=200";
  };

  return (
    <ProfileSettingsContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handlePhotoUpload,
        handleLogout,
        handleDeleteAccount,
        getProfilePhotoUrl,
        updateUser,
      }}
    >
      {children}
    </ProfileSettingsContext.Provider>
  );
};

export const useProfileSettingsContext = () => {
  const ctx = useContext(ProfileSettingsContext);
  if (!ctx)
    throw new Error(
      "useProfileSettingsContext must be used inside ProfileSettingsProvider"
    );
  return ctx;
};