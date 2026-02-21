import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) {
    return null;
  }

  function getProfilePhotoUrl() {
    if (user.verificationPhoto) {
      return (
        "http://127.0.0.1:5050/uploads/verifications/" + user.verificationPhoto
      );
    }
    let name = "User";
    if (user.name) {
      name = user.name;
    }
    return (
      "https://ui-avatars.com/api/?name=" +
      name +
      "&background=4f46e5&color=fff&size=100"
    );
  }

  function handleEditProfile() {
    setShowDropdown(false);
    navigate("/settings");
  }

  function openDropdown() {
    setShowDropdown(true);
  }

  function closeDropdown() {
    setShowDropdown(false);
  }

  function toggleDropdown() {
    if (showDropdown) {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
  }

  let arrowClass = "w-4 h-4 text-gray-500 transition-transform";
  if (showDropdown) {
    arrowClass = "w-4 h-4 text-gray-500 transition-transform rotate-180";
  }

  return (
    <div className="flex items-center gap-4">
      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
        >
          <img
            src={getProfilePhotoUrl()}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-indigo-500"
          />

          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>

          <svg
            className={arrowClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showDropdown && (
          <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
        )}

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={getProfilePhotoUrl()}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-indigo-500"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleEditProfile}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition"
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
              <span className="text-sm font-semibold text-gray-700">
                Edit Profile
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
