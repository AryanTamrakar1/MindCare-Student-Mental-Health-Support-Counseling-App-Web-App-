import React from "react";
import { ResetPasswordProvider } from "../context/resetPassword/ResetPasswordContext";
import { useResetPassword } from "../hooks/resetPassword/useResetPassword";
import { Eye, EyeOff, Lock } from "lucide-react";

const ResetPasswordInner = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    loading,
    verifying,
    error,
    success,
    handleSubmit,
    handleRequestNewLink,
    handleGoToLogin,
  } = useResetPassword();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/50 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-100/50 blur-3xl"></div>

      <div className="relative flex flex-col w-full max-w-md">
        <div className="bg-white p-10 shadow-2xl w-full text-center border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-500 text-sm font-medium">Verifying link...</p>
            </div>
          ) : error ? (
            <>
              <div className="w-20 h-20 bg-red-50 text-red-600 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Link Expired
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-10">
                {error}
              </p>

              <button
                onClick={handleRequestNewLink}
                className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg"
              >
                Request New Link
              </button>
            </>
          ) : success ? (
            <>
              <div className="w-20 h-20 bg-green-50 text-green-600 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Password Reset
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-10">
                Your password has been reset successfully. You can now login with your new password.
              </p>

              <button
                onClick={handleGoToLogin}
                className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg"
              >
                Go to Login
              </button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-50 text-blue-600 mx-auto mb-6 flex items-center justify-center">
                <Lock size={32} strokeWidth={1.5} />
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Create New Password
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-10">
                Enter your new password below
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium pr-12"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                </div>

                <div className="text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium pr-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  return (
    <ResetPasswordProvider>
      <ResetPasswordInner />
    </ResetPasswordProvider>
  );
};

export default ResetPassword;