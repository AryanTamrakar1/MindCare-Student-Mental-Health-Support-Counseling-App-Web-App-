import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import StudentSidebar from "../components/StudentSidebar";
import CounselorSidebar from "../components/CounselorSidebar";
import Navbar from "../components/Navbar"; // ADDED THIS
import API from "../api/axios";

const ProfileSettings = () => {
  const { user: contextUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(contextUser);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile photo updated successfully!");

      const updatedUserData = {
        ...currentUser,
        verificationPhoto: res.data.verificationPhoto,
      };
      setCurrentUser(updatedUserData);
      updateUser({ verificationPhoto: res.data.verificationPhoto });
    } catch (err) {
      alert(err.response?.data?.message || "Photo upload failed");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

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
        name: name,
      };

      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const res = await API.put("/auth/update-profile", updateData);

      const updatedUserData = { ...currentUser, name: res.data.user.name };
      setCurrentUser(updatedUserData);
      updateUser({ name: res.data.user.name });

      alert("Profile updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal details here
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Security & Password
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your password and security settings
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 text-sm font-medium transition"
                      >
                        {showCurrent ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 text-sm font-medium transition"
                      >
                        {showNew ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 text-sm font-medium transition"
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Account Overview
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    View your account information and status
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-40 h-40 rounded-full relative overflow-hidden border-4 border-indigo-100">
                    <img
                      src={getProfilePhotoUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "User")}&background=4f46e5&color=fff&size=200`;
                      }}
                    />
                  </div>
                  <label className="bg-gray-100 border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-200 transition">
                    Update Photo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>

                <div className="w-full flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-base font-semibold">
                      Full Name
                    </span>
                    <span className="text-gray-900 font-bold text-base">
                      {currentUser?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-base font-semibold">
                      Email Address
                    </span>
                    <span className="text-gray-900 font-bold text-base">
                      {currentUser?.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-base font-semibold">
                      System Role
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                      {currentUser?.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-base font-semibold">
                      Member Since
                    </span>
                    <span className="text-gray-900 font-bold text-base">
                      Dec 15, 2025
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-base font-semibold">
                      Last Login
                    </span>
                    <span className="text-gray-900 font-bold text-base">
                      Feb 16, 2026
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4">
                    <span className="text-gray-500 text-base font-semibold">
                      Account Status
                    </span>
                    <span className="text-green-600 font-bold text-base">
                      ● Verified Account
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
