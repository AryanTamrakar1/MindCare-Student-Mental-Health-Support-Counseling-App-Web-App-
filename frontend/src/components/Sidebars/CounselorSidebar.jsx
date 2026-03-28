import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  UserCircle,
  MessageSquare,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

const CounselorSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  function isActive(path) {
    return location.pathname === path;
  }

  function menuNavigate(path) {
    navigate(path, { state: { user } });
  }

  const navItems = [
    { path: "/counselor-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/pending-requests", label: "Pending Requests", icon: Clock },
    { path: "/counselor-sessions", label: "My Sessions", icon: CalendarDays },
    { path: "/edit-profile", label: "Edit Profile", icon: UserCircle },
    { path: "/community-forum", label: "Community Forum", icon: MessageSquare },
    { path: "/counselor-ratings", label: "Session Ratings", icon: Star },
  ];

  return (
    <aside
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="w-[260px] min-w-[260px] max-w-[260px] bg-white border-r border-[#F1F1F1] fixed top-[72px] bottom-0 left-0 flex flex-col justify-between overflow-y-auto"
    >
      <nav className="flex flex-col gap-2 px-3 pt-6">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => menuNavigate(path)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[16px] w-full text-left transition-all duration-150 ${
                active
                  ? "bg-[#EEF2FF] text-[#2563EB] font-semibold"
                  : "text-[#374151] hover:bg-[#F9FAFB] font-medium"
              }`}
            >
              <Icon
                size={20}
                className={active ? "text-[#2563EB]" : "text-[#9CA3AF]"}
                strokeWidth={active ? 2.5 : 2}
              />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-7">
        <div className="border-t border-[#F1F1F1] pt-4 flex flex-col gap-2">
          <button
            onClick={() => menuNavigate("/settings")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[16px] w-full text-left transition-all duration-150 font-medium ${
              isActive("/settings")
                ? "bg-[#EEF2FF] text-[#2563EB] font-semibold"
                : "text-[#374151] hover:bg-[#F9FAFB]"
            }`}
          >
            <Settings
              size={20}
              className={isActive("/settings") ? "text-[#2563EB]" : "text-[#9CA3AF]"}
              strokeWidth={2}
            />
            Settings
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[16px] font-medium text-[#374151] hover:bg-[#F9FAFB] w-full text-left transition-all duration-150"
          >
            <LogOut size={20} className="text-[#9CA3AF]" strokeWidth={2} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CounselorSidebar;