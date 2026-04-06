import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Heart } from "lucide-react";
import NotificationDropdown from "./notifications/NotificationDropdown";

const pageTitles = {
  "/student-dashboard": "Student Dashboard",
  "/counselors": "Find Counselor",
  "/mood-quiz": "Weekly Mood Quiz",
  "/community-forum": "Community Forum",
  "/my-sessions": "My Sessions",
  "/resource-library": "Resource Library",
  "/student/gamification": "My Progress",
  "/counselor-dashboard": "Counselor Dashboard",
  "/pending-requests": "Pending Requests",
  "/counselor-sessions": "My Sessions",
  "/edit-profile": "Edit Profile",
  "/counselor-ratings": "Session Ratings",
  "/admin-dashboard": "Admin Dashboard",
  "/user-management": "User Management",
  "/counselor-approvals": "Counselor Approvals",
  "/post-management": "Post Management",
  "/admin-analytics": "Platform Analytics",
  "/admin-resource-library": "Resource Library",
  "/settings": "Settings",
  "/profile-settings": "Profile Settings",
};

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) {
    return null;
  }

  const pageTitle = pageTitles[location.pathname] || "MindCare";

function getProfilePhotoUrl() {
  if (user.verificationPhoto) {
    if (user.verificationPhoto.startsWith("http")) {
      return user.verificationPhoto;
    }
    return user.verificationPhoto;
  }
  let name = "User";
  if (user.name) {
    name = user.name;
  }
  return "https://ui-avatars.com/api/?name=" + name + "&background=2563EB&color=fff&size=100";
}

  function handleEditProfile() {
    setShowDropdown(false);
    navigate("/settings");
  }

  function closeDropdown() {
    setShowDropdown(false);
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-[#F1F1F1] h-[72px]"
    >
      <div className="flex items-center h-full">
        <div className="flex items-center justify-center w-[260px] flex-shrink-0 px-6 h-full border-r border-[#F1F1F1]">
          <img
            src="/MindCareLogo.png"
            alt="MindCare Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        <span className="pl-8 text-[16px] font-medium text-[#6B7280]">
          {pageTitle}
        </span>
      </div>

      <div className="flex items-center gap-4 px-8">
        <NotificationDropdown />

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 hover:bg-[#F9FAFB] rounded-xl px-3 py-2 transition-all duration-150"
          >
            <img
              src={getProfilePhotoUrl()}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-[#E5E7EB]"
            />
            <div className="text-left">
              <p className="text-[16px] font-semibold text-[#111827] leading-tight">
                {user.name}
              </p>
              <p className="text-[14px] text-[#6B7280] leading-tight capitalize">
                {user.role}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-[#9CA3AF] transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showDropdown && (
            <div className="fixed inset-0 z-40" onClick={closeDropdown} />
          )}

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border border-[#F1F1F1] z-50">
              <div className="p-4 border-b border-[#F1F1F1]">
                <div className="flex items-center gap-3">
                  <img
                    src={getProfilePhotoUrl()}
                    alt="Profile"
                    className="w-11 h-11 rounded-full border-2 border-[#E5E7EB]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#111827] leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[13px] text-[#6B7280] leading-tight mt-0.5 break-all">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#EEF2FF] text-[#2563EB] text-[12px] font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="w-full text-left px-4 py-3 hover:bg-[#F9FAFB] flex items-center gap-3 transition-all duration-150"
              >
                <svg
                  className="w-[18px] h-[18px] text-[#9CA3AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="text-[15px] font-medium text-[#374151]">
                  Edit Profile
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
