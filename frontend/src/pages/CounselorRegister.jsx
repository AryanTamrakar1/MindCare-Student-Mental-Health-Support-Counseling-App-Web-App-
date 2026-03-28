import React, { useState } from "react";
import { Info, Eye, EyeOff } from "lucide-react";
import { CounselorRegisterProvider } from "../context/counselorRegister/CounselorRegisterContext";
import { useCounselorRegister } from "../hooks/counselorRegister/useCounselorRegister";

const CounselorRegisterInner = () => {
  const {
    googleUser,
    name, setName,
    email, setEmail,
    password, setPassword,
    phone, setPhone,
    qualifications, setQualifications,
    experience, setExperience,
    specialization, setSpecialization,
    licenseNo, setLicenseNo,
    bio, setBio,
    photo, setPhoto,
    confirmPassword, setConfirmPassword,
    handleRegister,
    handleBackToLogin,
  } = useCounselorRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full mb-4">
        <button
          onClick={handleBackToLogin}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition"
        >
          ← Back to Login
        </button>
      </div>

      <div className="bg-white py-10 px-10 shadow-xl max-w-2xl mx-auto w-full border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Counselor Application</h2>
          {googleUser ? (
            <p className="text-blue-600 font-bold mt-2">Completing profile for: {googleUser.email}</p>
          ) : (
            <p className="text-gray-500 mt-2 font-medium">Join our network of professional counselors</p>
          )}
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {!googleUser && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="Dr. John Doe" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </>
            )}

            {googleUser && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="Dr. John Doe" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-not-allowed" disabled value={email} />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input type="text" placeholder="+977 1234567890" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">License No.</label>
              <input type="text" placeholder="LKM-12345789" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Highest Qualification</label>
              <input type="text" placeholder="e.g. PhD in Clinical Psychology" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={qualifications} onChange={(e) => setQualifications(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Years of Exp.</label>
              <input type="number" placeholder="1" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
              <input type="text" placeholder="e.g. Anxiety, Stress Management" className="w-full p-3 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upload Your Photo for Verification</label>
              <div className="relative group">
                <input type="file" accept="image/*" required className="w-full p-8 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer text-transparent file:hidden" onChange={(e) => setPhoto(e.target.files[0])} />
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

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Statement of Purpose</label>
              <textarea
                placeholder="Describe your motivation..."
                className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-medium text-justify resize-none overflow-y-auto"
                style={{ minHeight: "96px", maxHeight: "160px" }}
                required
                value={bio}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Create Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 pr-12 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
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
                className="w-full p-3 pr-12 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="p-5 bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              <strong>Application Process:</strong> Your account will remain <strong>Pending</strong>. You will be able to log in once our Admin has verified your credentials.
            </p>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all text-lg">
            {googleUser ? "Complete & Submit Application" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

const CounselorRegister = () => (
  <CounselorRegisterProvider>
    <CounselorRegisterInner />
  </CounselorRegisterProvider>
);

export default CounselorRegister;