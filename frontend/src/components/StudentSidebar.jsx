import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  ClipboardList,
  MessageSquare,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

const StudentSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const menuNavigate = (path) => {
    navigate(path, { state: { user } });
  };

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
            onClick={() => menuNavigate("/student-dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold ${
              isActive("/student-dashboard")
                ? "bg-[#1f2937] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <Home size={20} />
            HOME
          </button>

          <button
            onClick={() => menuNavigate("/counselors")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold ${
              isActive("/counselors")
                ? "bg-[#1f2ff] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <Search size={20} />
            FIND COUNSELOR
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#9ca3af] hover:bg-[#1f2937] hover:text-white">
            <ClipboardList size={20} />
            WEEKLY MOOD QUIZ
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#9ca3af] hover:bg-[#1f2937] hover:text-white">
            <MessageSquare size={20} />
            COMMUNITY FORUM
          </button>

          <button
            onClick={() => menuNavigate("/my-sessions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold ${
              isActive("/my-sessions")
                ? "bg-[#1f2937] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <Calendar size={20} />
            MY SESSION
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#9ca3af] hover:bg-[#1f2937] hover:text-white">
            <BookOpen size={20} />
            RESOURCE LIBRARY
          </button>
        </nav>
      </div>

      <div>
        <div className="border-t border-[#374151] mb-3"></div>

        <button
          onClick={() => menuNavigate("/settings")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold w-full ${
            isActive("/settings")
              ? "bg-[#1f2937] text-white"
              : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
          }`}
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

export default StudentSidebar;
