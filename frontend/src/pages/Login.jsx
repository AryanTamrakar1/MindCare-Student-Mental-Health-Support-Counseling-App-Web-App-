import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { LoginProvider } from "../context/login/LoginContext";
import { useLogin } from "../hooks/login/useLogin";

const LoginInner = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleGoogleLogin,
  } = useLogin();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-100/50 blur-3xl" />

      <div className="relative flex flex-col w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-white p-10 shadow-2xl w-full text-center border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm font-medium mb-10">
            Sign in to continue your wellness journey
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-right text-xs font-semibold text-blue-600 hover:text-blue-700 transition mt-1 w-full"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white px-4 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center mb-8 scale-110">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Login Failed")}
            />
          </div>

          <p className="text-sm text-gray-500 font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/role-selection", { state: { from: "login" } })}
              className="text-blue-600 font-black hover:text-blue-700 transition"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <LoginProvider>
      <LoginInner />
    </LoginProvider>
  );
};

export default Login;