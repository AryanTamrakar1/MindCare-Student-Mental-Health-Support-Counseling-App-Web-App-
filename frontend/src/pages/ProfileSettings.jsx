import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import PersonalInfoForm from "../components/profileSettings/PersonalInfoForm";
import PasswordForm from "../components/profileSettings/PasswordForm";
import AccountOverview from "../components/profileSettings/AccountOverview";

const ProfileSettings = () => {
  const { user: contextUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(contextUser);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    if (contextUser) {
      setCurrentUser(contextUser);
      setName(contextUser.name || "");
      setLoading(false);
    } else {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setName(userData.name || "");
        setLoading(false);
      } else {
        navigate("/");
      }
    }
  }, [contextUser, navigate]);

  const renderSidebar = () => {
    if (!currentUser) return null;
    if (currentUser.role === "Admin")
      return <AdminSidebar user={currentUser} />;
    if (currentUser.role === "Counselor")
      return <CounselorSidebar user={currentUser} />;
    return <StudentSidebar user={currentUser} />;
  };

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
      setCurrentUser({
        ...currentUser,
        verificationPhoto: res.data.verificationPhoto,
      });
      updateUser({ verificationPhoto: res.data.verificationPhoto });
    } catch (err) {
      alert(err.response?.data?.message || "Photo upload failed");
    }
  };

  const handleSaveName = async () => {
    try {
      const updateData = { userId: currentUser._id, name };
      const res = await API.put("/auth/update-profile", updateData);
      setCurrentUser({ ...currentUser, name: res.data.user.name });
      updateUser({ name: res.data.user.name });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handlePasswordSubmit = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields to change your password.");
        return;
      }
      if (currentPassword === newPassword) {
        alert("New password cannot be the same as the current password!");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }
    }

    try {
      const updateData = {
        userId: currentUser._id,
        name,
        currentPassword,
        newPassword,
      };
      await API.put("/auth/update-profile", updateData);
      alert("Password updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const getProfilePhotoUrl = () => {
    if (currentUser?.verificationPhoto) {
      return `http://127.0.0.1:5050/uploads/verifications/${currentUser.verificationPhoto}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "User")}&background=4f46e5&color=fff&size=200`;
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        {renderSidebar()}
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Settings...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {renderSidebar()}
      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Settings</h2>
            <p className="text-gray-500">
              Manage your account details and security.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoForm
              name={name}
              setName={setName}
              email={currentUser.email || ""}
              onSave={handleSaveName}
            />
            <PasswordForm onSubmit={handlePasswordSubmit} />
          </div>

          <div className="lg:col-span-1">
            <AccountOverview
              currentUser={currentUser}
              onPhotoUpload={handlePhotoUpload}
              getProfilePhotoUrl={getProfilePhotoUrl}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
