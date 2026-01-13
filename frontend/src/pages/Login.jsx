import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // This function handles where to send the user after login
  const handleRedirect = (user) => {
    if (user.role === "Admin") {
      navigate("/admin-dashboard", { state: { user } });
    } else if (user.role === "Student") {
      navigate("/student-dashboard", { state: { user } });
    } else if (user.role === "Counselor") {
      navigate("/counselor-dashboard", { state: { user } });
    } else {
      // If for some reason role is missing
      navigate("/");
    }
  };

  // Login 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const userData = res.data.user;
      localStorage.setItem("token", res.data.token); 

      alert("Login Successful!");
      handleRedirect(userData);
      
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl"></div>

      <div className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-200">
          <span className="text-white text-4xl font-black">M</span>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-gray-500 text-sm font-medium mb-10">Sign in to continue your wellness journey</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-lg mt-2">
            Sign In
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-gray-400">Or continue with</span></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center mb-8 scale-110">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await API.post("/auth/google-login", {
                  token: credentialResponse.credential,
                });
                const userData = res.data.user;
                localStorage.setItem("token", res.data.token);

                if (userData.role === "Pending_Selection") {
                  navigate("/role-selection", { state: { user: userData } });
                } else {
                  handleRedirect(userData);
                }
              } catch (err) {
                alert("Google Login Error");
              }
            }}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <p className="text-sm text-gray-500 font-medium">
          Don't have an account? 
          <button onClick={() => setShowModal(true)} className="text-indigo-600 font-black ml-2 hover:underline">Register Now</button>
        </p>
      </div>

      {/* --- PROFESSIONAL ROLE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-all duration-500"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center">
              <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Join MindCare</h3>
              <p className="text-gray-500 mb-10 font-medium text-sm">Select your account type to continue</p>
              
              <div className="space-y-4">
                {/* Student Option */}
                <button 
                  onClick={() => navigate("/register/student")}
                  className="w-full group p-6 flex items-center gap-5 border-2 border-indigo-50 rounded-[2rem] hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🎓
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Student</h4>
                    <p className="text-xs text-gray-400 font-medium">I want to receive professional counseling.</p>
                  </div>
                </button>

                {/* Counselor Option */}
                <button 
                  onClick={() => navigate("/register/counselor")}
                  className="w-full group p-6 flex items-center gap-5 border-2 border-emerald-50 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🩺
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Counselor</h4>
                    <p className="text-xs text-gray-400 font-medium">I am a professional counselor.</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setShowModal(false)} 
                className="mt-10 text-xs font-black text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-[0.2em]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;