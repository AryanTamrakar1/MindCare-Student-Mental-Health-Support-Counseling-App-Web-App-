import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import StudentSidebar from "../components/StudentSidebar";
import CounselorSidebar from "../components/CounselorSidebar";
import API from "../api/axios";

const ProfileSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(location.state?.user);

  // Form States
  const [name, setName] = useState(currentUser?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle States for showing/hiding password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!currentUser) {
    navigate("/");
    return null;
  }

  const renderSidebar = () => {
    if (currentUser.role === "Admin") return <AdminSidebar user={currentUser} />;
    if (currentUser.role === "Counselor") return <CounselorSidebar user={currentUser} />;
    return <StudentSidebar user={currentUser} />;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Check if user is trying to change password
    if (currentPassword || newPassword || confirmPassword) {
      // Check if all password fields are filled
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields to change your password.");
        return;
      }
      // Check if new password matches old password
      if (currentPassword === newPassword) {
        alert("New password cannot be the same as the current password!");
        return;
      }
      // Check if new password matches confirm password
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
      
      setCurrentUser({ ...currentUser, name: res.data.user.name });
      alert("Profile updated successfully!");
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-inter">
      <Navbar user={currentUser} />

      <div className="flex flex-1">
        {renderSidebar()}

        <main className="flex-1 p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-[32px] font-extrabold text-[#111827]">Profile Settings</h1>
            <p className="text-[#6b7280] mt-2">Manage your account information and security preferences.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white p-8 rounded-[20px] border border-[#e5e7eb]">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Edit Personal Information
              </h2>
              
              <form onSubmit={handleUpdateProfile} className="flex flex-col">
                <div className="flex flex-col mb-5">
                  <label className="text-[13px] font-bold text-[#374151] mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 px-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] text-sm outline-none focus:border-[#4f46e5]"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="flex flex-col mb-5">
                  <label className="text-[13px] font-bold text-[#374151] mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={currentUser?.email} 
                    disabled 
                    className="p-3 px-4 rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] text-[#9ca3af] text-sm cursor-not-allowed"
                  />
                </div>

                <hr className="my-5 border-[#f3f4f6]" />
                
                <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                  Change Password
                </h2>

                {/* CURRENT PASSWORD */}
                <div className="flex flex-col mb-5 relative">
                  <label className="text-[13px] font-bold text-[#374151] mb-2">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrent ? "text" : "password"} 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="********"
                      className="w-full p-3 px-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] text-sm outline-none focus:border-[#4f46e5]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase"
                    >
                      {showCurrent ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NEW PASSWORD */}
                  <div className="flex flex-col mb-5 relative">
                    <label className="text-[13px] font-bold text-[#374151] mb-2">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNew ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full p-3 px-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] text-sm outline-none focus:border-[#4f46e5]"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase"
                      >
                        {showNew ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="flex flex-col mb-5 relative">
                    <label className="text-[13px] font-bold text-[#374151] mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirm ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full p-3 px-4 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] text-sm outline-none focus:border-[#4f46e5]"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase"
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-[#4f46e5] text-white py-3.5 px-10 rounded-[12px] font-bold hover:bg-[#4338ca] transition mt-4 w-fit"
                >
                  Save Changes
                </button>
              </form>
            </section>

            <section className="bg-white p-8 rounded-[20px] border border-[#e5e7eb] h-fit">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Account Overview
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-4 border-b border-[#f3f4f6]">
                  <span className="text-sm text-[#6b7280]">User Role</span>
                  <span className="bg-[#eef2ff] text-[#4f46e5] px-3 py-1 rounded-md text-xs font-bold">{currentUser?.role}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[#f3f4f6]">
                  <span className="text-sm text-[#6b7280]">Account Status</span>
                  <span className="text-sm font-bold text-[#059669]">Verified</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-sm text-[#6b7280]">Member Since</span>
                  <span className="text-sm font-bold text-[#111827]">Dec 2025</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;