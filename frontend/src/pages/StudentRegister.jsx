import React, { useState } from "react";
import { useStudentRegister } from "../hooks/studentRegister/useStudentRegister";
import { StudentRegisterProvider } from "../context/studentRegister/StudentRegisterContext";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

const StudentRegisterInner = () => {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    studentId, setStudentId,
    phone, setPhone,
    dob, setDob,
    gender, setGender,
    photo, setPhoto,
    confirmPassword, setConfirmPassword,
    googleData,
    handleRegister,
    goToLogin,
  } = useStudentRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-2xl mx-auto w-full mb-4">
        <button
          onClick={goToLogin}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition"
        >
          ← Back to Login
        </button>
      </div>

      <div className="bg-white py-10 px-8 sm:px-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-2xl mx-auto w-full border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Student Enrollment</h2>
          {googleData ? (
            <p className="text-blue-600 font-bold mt-2">Completing profile for: {googleData.email}</p>
          ) : (
            <p className="text-gray-400 font-medium mt-2">Enter your academic details to get started.</p>
          )}
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!googleData && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">University Email</label>
                  <input
                    type="email"
                    placeholder="john@university.edu"
                    className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

            {googleData && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">University Email</label>
                  <input
                    type="email"
                    placeholder="john@university.edu"
                    className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none cursor-not-allowed"
                    disabled
                    value={email}
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student ID</label>
              <input
                type="text"
                placeholder="202350999"
                className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="text"
                placeholder="+977 1234567890"
                className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input
                type="date"
                className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select
                className="w-full bg-gray-50 border-none p-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none appearance-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upload Student ID Photo</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                required
                className="w-full p-8 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer text-transparent file:hidden"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
                {photo ? (
                  <div className="flex items-center gap-4 w-full h-full px-4">
                    <img src={URL.createObjectURL(photo)} alt="Preview" className="h-12 w-12 object-cover border border-gray-200" />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900">Photo selected</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{photo.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-400">Click to select or drag photo here</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none p-4 pr-12 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none p-4 pr-12 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 font-bold mt-4 hover:bg-blue-700 shadow-[0_10px_25px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98] text-lg">
            {googleData ? "Complete & Create Student Account" : "Create Student Account"}
          </button>
        </form>

        {!googleData && (
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Already have an account?
              <button onClick={goToLogin} className="text-blue-600 font-bold ml-1 hover:text-blue-700 transition">Sign In</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentRegister = () => (
  <StudentRegisterProvider>
    <StudentRegisterInner />
  </StudentRegisterProvider>
);

export default StudentRegister;