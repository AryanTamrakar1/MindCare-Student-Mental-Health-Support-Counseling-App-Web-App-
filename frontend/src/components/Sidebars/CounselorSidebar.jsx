import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Clock,
  Calendar,
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
    if (location.pathname === path) {
      return true;
    }
    return false;
  }

  function menuNavigate(path) {
    navigate(path, { state: { user } });
  }

  function getButtonClass(path) {
    if (isActive(path)) {
      return "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold w-full bg-[#1f2937] text-white";
    }
    return "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold w-full text-[#9ca3af] hover:bg-[#1f2937] hover:text-white";
  }

  return (
    <aside className="w-[280px] min-w-[280px] max-w-[280px] bg-[#111827] text-white fixed h-screen flex flex-col justify-between p-[30px_20px] overflow-y-auto">
      <div>
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#4f46e5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div className="text-2xl font-bold">
            <span className="text-white">Mind</span>
            <span className="text-[#818cf8]">CARE</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <button
            onClick={function () {
              menuNavigate("/counselor-dashboard");
            }}
            className={getButtonClass("/counselor-dashboard")}
          >
            <Home size={20} />
            HOME
          </button>

          <button
            onClick={function () {
              menuNavigate("/pending-requests");
            }}
            className={getButtonClass("/pending-requests")}
          >
            <Clock size={20} />
            PENDING REQUESTS
          </button>

          <button
            onClick={function () {
              menuNavigate("/counselor-sessions");
            }}
            className={getButtonClass("/counselor-sessions")}
          >
            <Calendar size={20} />
            MY SESSIONS
          </button>

          <button
            onClick={function () {
              menuNavigate("/edit-profile");
            }}
            className={getButtonClass("/edit-profile")}
          >
            <UserCircle size={20} />
            EDIT PROFILE
          </button>

          <button
            onClick={function () {
              menuNavigate("/community-forum");
            }}
            className={getButtonClass("/community-forum")}
          >
            <MessageSquare size={20} />
            COMMUNITY FORUM
          </button>

          <button
            onClick={function () {
              menuNavigate("/counselor-ratings");
            }}
            className={getButtonClass("/counselor-ratings")}
          >
            <Star size={20} />
            SESSION RATINGS
          </button>
        </nav>
      </div>

      <div>
        <div className="border-t border-[#374151] mb-3"></div>

        <button
          onClick={function () {
            menuNavigate("/settings");
          }}
          className={getButtonClass("/settings")}
        >
          <Settings size={20} />
          SETTINGS
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#f87171] hover:bg-red-900 hover:bg-opacity-20 w-full mt-1"
        >
          <LogOut size={20} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default CounselorSidebar;
