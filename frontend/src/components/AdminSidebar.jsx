import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserCheck,
  FileText,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

const AdminSidebar = ({ user }) => {
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
            onClick={() => menuNavigate("/admin-dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold whitespace-nowrap ${
              isActive("/admin-dashboard")
                ? "bg-[#1f2937] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <Home size={20} className="flex-shrink-0" />
            HOME
          </button>

          <button
            onClick={() => menuNavigate("/user-management")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold whitespace-nowrap ${
              isActive("/user-management")
                ? "bg-[#1f2937] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <Users size={20} className="flex-shrink-0" />
            USER MANAGEMENT
          </button>

          <button
            onClick={() => menuNavigate("/counselor-approvals")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold whitespace-nowrap ${
              isActive("/counselor-approvals")
                ? "bg-[#1f2937] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <UserCheck size={20} className="flex-shrink-0" />
            COUNSELOR APPROVALS
          </button>

          <button
            onClick={() => menuNavigate("/post-management")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold whitespace-nowrap ${
              isActive("/post-management")
                ? "bg-[#1f2937] text-white"
                : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
            }`}
          >
            <FileText size={20} className="flex-shrink-0" />
            POST MANAGEMENT
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#9ca3af] hover:bg-[#1f2937] hover:text-white whitespace-nowrap">
            <BarChart3 size={20} className="flex-shrink-0" />
            PLATFORM ANALYTICS
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#9ca3af] hover:bg-[#1f2937] hover:text-white whitespace-nowrap">
            <BookOpen size={20} className="flex-shrink-0" />
            RESOURCE LIBRARY
          </button>
        </nav>
      </div>

      <div>
        <div className="border-t border-[#374151] mb-3"></div>

        <button
          onClick={() => menuNavigate("/settings")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold w-full whitespace-nowrap ${
            isActive("/settings")
              ? "bg-[#1f2937] text-white"
              : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          SETTINGS
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold text-[#f87171] hover:bg-red-900 hover:bg-opacity-20 w-full mt-1 whitespace-nowrap"
        >
          <LogOut size={20} className="flex-shrink-0" />
          LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
