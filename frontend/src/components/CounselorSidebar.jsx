import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const CounselorSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuNavigate = (path) => {
    navigate(path, { state: { user } });
  };

  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between p-6 min-h-[calc(100vh-70px)]">
      <div>
        <ul className="space-y-2">
          <li
            onClick={() => menuNavigate("/counselor-dashboard")}
            className={`p-3 font-semibold cursor-pointer rounded-xl transition ${
              isActive("/counselor-dashboard")
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Home
          </li>
          <li
            onClick={() => menuNavigate("/pending-requests")}
            className={`p-3 font-semibold cursor-pointer rounded-xl transition ${
              isActive("/pending-requests")
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Pending Requests
          </li>
          <li className="p-3 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-xl">
            My Sessions
          </li>
          <li
            onClick={() => menuNavigate("/edit-profile")}
            className={`p-3 font-semibold cursor-pointer rounded-xl transition ${
              isActive("/edit-profile")
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Edit Profile
          </li>

          <li className="p-3 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-xl">
            Community Forum
          </li>
          <li className="p-3 text-gray-600 font-semibold cursor-pointer hover:bg-gray-50 rounded-xl">
            Session Ratings
          </li>
          <li
            onClick={() => menuNavigate("/settings")}
            className={`p-3 font-semibold cursor-pointer rounded-xl transition ${
              isActive("/settings")
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Settings
          </li>
        </ul>
      </div>

      <button
        onClick={logout}
        className="w-full bg-[#ef4444] text-white p-3 rounded-lg font-bold hover:bg-red-600 transition"
      >
        LOGOUT
      </button>
    </aside>
  );
};

export default CounselorSidebar;
