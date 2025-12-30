import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const RoleSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const handleChoice = async (role) => {
    if (role === "Student") {
      try {
        const res = await API.put("/auth/update-role", {
          email: user.email,
          role: "Student",
        });
        alert("Welcome! You are now registered as a Student.");
        navigate("/dashboard", { state: { user: res.data.user } });
      } catch (err) {
        alert("Error updating role");
      }
    } else {
      // Pass the user info to the counselor form
      navigate("/register/counselor", { state: { user: user } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>

      <div className="relative bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
        <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
          One Last Step!
        </h2>
        <p className="text-gray-500 mb-10 font-medium">
          Hi <span className="text-indigo-600 font-bold">{user?.name}</span>, how would you like to use MindCare?
        </p>

        <div className="grid grid-cols-1 gap-5">
          {/* STUDENT CARD */}
          <button
            onClick={() => handleChoice("Student")}
            className="group p-6 border-2 border-indigo-50 rounded-[2rem] hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left flex items-center space-x-5 shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
              🎓
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xl">I am a Student</h4>
              <p className="text-sm text-gray-400 leading-tight">I want to seek professional counseling support.</p>
            </div>
          </button>

          {/* COUNSELOR CARD */}
          <button
            onClick={() => handleChoice("Counselor")}
            className="group p-6 border-2 border-emerald-50 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex items-center space-x-5 shadow-sm hover:shadow-md"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
              🩺
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xl">I am a Counselor</h4>
              <p className="text-sm text-gray-400 leading-tight">I am a professional verified to provide help.</p>
            </div>
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 text-sm font-bold text-gray-300 hover:text-gray-500 transition"
        >
          Cancel and Logout
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;