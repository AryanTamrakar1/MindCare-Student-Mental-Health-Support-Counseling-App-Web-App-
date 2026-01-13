import React from 'react';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-[#4f46e5] h-[70px] px-10 flex justify-between items-center sticky top-0 z-50 shadow-md">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        {/* The "M" Icon */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-[#4f46e5] font-black text-xl">M</span>
        </div>

        {/* Logo Text: Mind (White) Care (Light Purple) */}
        <span className="font-black text-2xl tracking-tight uppercase">
          <span className="text-white">MIND</span>
          <span className="text-[#c7d2fe]">CARE</span> 
        </span>
      </div>

      {/* User Info Section */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          {/* Shows the Role (Admin, Student, or Counselor) */}
          <p className="text-[10px] font-black text-[#c7d2fe] uppercase tracking-widest leading-tight">
            {user?.role || "Guest"}
          </p>
          {/* Shows the name of the user that logged in */}
          <p className="text-sm font-bold text-white">
            {user?.name || "User"}
          </p>
        </div>

        {/* Profile Bubble */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4f46e5] font-black shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;