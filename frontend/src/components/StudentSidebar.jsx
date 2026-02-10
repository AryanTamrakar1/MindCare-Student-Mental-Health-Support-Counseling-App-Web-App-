import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StudentSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuNavigate = (path) => {
    navigate(path, { state: { user } });
  };

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col justify-between p-[30px_20px] min-h-[calc(100vh-70px)]">
      <div>
        <ul className="list-none">
          <li
            onClick={() => menuNavigate("/student-dashboard")}
            className={`p-[12px_16px] mb-2 rounded-lg font-bold cursor-pointer transition ${
              isActive("/student-dashboard")
                ? "bg-[#eef2ff] text-[#4f46e5]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Home
          </li>
          <li
            onClick={() => menuNavigate("/counselors")} 
            className={`p-[12px_16px] mb-2 rounded-lg font-semibold cursor-pointer transition ${
              isActive("/counselors") 
                ? "bg-[#eef2ff] text-[#4f46e5] font-bold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Find Counselors
          </li>
          <li className="p-[12px_16px] mb-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-lg">
            Weekly Mood Quiz
          </li>
          <li className="p-[12px_16px] mb-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-lg">
            Community Forum
          </li>
          <li className="p-[12px_16px] mb-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-lg">
            My Sessions
          </li>
          <li className="p-[12px_16px] mb-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-lg">
            Resource Library
          </li>
          <li
            onClick={() => menuNavigate("/settings")}
            className={`p-[12px_16px] mb-2 rounded-lg font-semibold cursor-pointer transition ${
              isActive("/settings")
                ? "bg-[#eef2ff] text-[#4f46e5] font-bold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Settings
          </li>
        </ul>
      </div>

      <button
        onClick={() => navigate("/")}
        className="w-full bg-[#ef4444] text-white p-3 rounded-lg font-bold hover:bg-red-600 transition"
      >
        LOGOUT
      </button>
    </aside>
  );
};

export default StudentSidebar;
