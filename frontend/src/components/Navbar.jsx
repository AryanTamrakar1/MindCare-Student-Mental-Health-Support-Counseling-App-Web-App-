import React from 'react';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-indigo-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-indigo-700 font-bold">M</span>
        </div>
        <span className="font-bold text-xl tracking-tight uppercase">MindCare</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm text-indigo-100 hidden md:block">
          Logged in as: <span className="font-semibold text-white">{user?.name || "User"}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;