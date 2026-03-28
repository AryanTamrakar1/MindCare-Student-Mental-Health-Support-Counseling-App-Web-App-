import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import PersonalInfoForm from "../components/profileSettings/PersonalInfoForm";
import PasswordForm from "../components/profileSettings/PasswordForm";
import AccountOverview from "../components/profileSettings/AccountOverview";
import { LogOut, Trash2 } from "lucide-react";
import { ProfileSettingsProvider } from "../context/profileSettings/ProfileSettingsContext";
import { PersonalInfoFormProvider } from "../context/profileSettings/PersonalInfoFormContext";
import { useProfileSettings } from "../hooks/profileSettings/useProfileSettings";

const ProfileSettingsInner = () => {
  const { user: contextUser } = useContext(AuthContext);
  const {
    currentUser,
    handlePhotoUpload,
    handleLogout,
    handleDeleteAccount,
    getProfilePhotoUrl,
  } = useProfileSettings();

  const renderSidebar = () => {
    if (!currentUser) return null;
    if (currentUser.role === "Admin")
      return <AdminSidebar user={currentUser} />;
    if (currentUser.role === "Counselor")
      return <CounselorSidebar user={currentUser} />;
    return <StudentSidebar user={currentUser} />;
  };

  if (!contextUser) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF] flex"
    >
      <Navbar />
      {renderSidebar()}
      <main
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{
          paddingTop: "calc(72px + 2.5rem)",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <PersonalInfoFormProvider>
              <PersonalInfoForm />
            </PersonalInfoFormProvider>
            <PasswordForm
              onSubmit={async (data) => {
                const confirmed = window.confirm(
                  "Are you sure you want to update your password?",
                );
                if (!confirmed) return;
                try {
                  const updateData = {
                    userId: currentUser._id,
                    name: currentUser.name,
                    ...data,
                  };
                  await API.put("/auth/update-profile", updateData);
                  alert("Password updated successfully!");
                } catch (err) {
                  alert(err.response?.data?.message || "Update failed");
                }
              }}
            />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-5">
            <AccountOverview
              currentUser={currentUser}
              onPhotoUpload={handlePhotoUpload}
              getProfilePhotoUrl={getProfilePhotoUrl}
            />

            <div className="bg-white border border-[#DBEAFE]">
              <div className="px-6 py-5 border-b border-[#DBEAFE]">
                <h3 className="text-[15px] font-semibold text-[#111827]">
                  Account Actions
                </h3>
                <p className="text-[13px] text-[#6B7280] mt-0.5">
                  Manage your session and account
                </p>
              </div>
              <div className="px-6 py-5 flex flex-col gap-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-[#DBEAFE] bg-[#F8FBFF] hover:bg-[#EFF6FF] text-[#374151] text-[14px] font-semibold transition-colors"
                >
                  <LogOut
                    size={16}
                    className="text-[#2563EB]"
                    strokeWidth={2}
                  />
                  Log Out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-[#FEE2E2] bg-[#FFF8F8] hover:bg-[#FEF2F2] text-[#DC2626] text-[14px] font-semibold transition-colors"
                >
                  <Trash2
                    size={16}
                    className="text-[#DC2626]"
                    strokeWidth={2}
                  />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileSettings = () => {
  return (
    <ProfileSettingsProvider>
      <ProfileSettingsInner />
    </ProfileSettingsProvider>
  );
};

export default ProfileSettings;
