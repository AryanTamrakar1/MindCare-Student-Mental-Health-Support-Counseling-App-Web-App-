import React from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { ForgotPasswordProvider } from "../context/forgotPassword/ForgotPasswordContext";
import { useForgotPassword } from "../hooks/forgotPassword/useForgotPassword";

const ForgotPasswordInner = () => {
  const {
    email,
    setEmail,
    loading,
    submitted,
    handleSubmit,
    handleBackToForm,
    handleBackToLogin,
  } = useForgotPassword();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/50 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-100/50 blur-3xl"></div>

      <div className="relative flex flex-col w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>

        <div className="bg-white p-10 shadow-2xl w-full text-center border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {!submitted ? (
            <>
              <div className="w-20 h-20 bg-blue-50 text-blue-600 mx-auto mb-6 flex items-center justify-center">
                <Mail size={32} strokeWidth={1.5} />
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Reset Password
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-10">
                Enter your email address and we'll send you a link to reset your password
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                We'll send a password reset link to your email. The link will expire in 1 hour.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-50 text-green-600 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Check Your Email
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-6">
                We've sent a password reset link to:
              </p>
              <p className="text-blue-600 font-bold mb-10 break-all">
                {email}
              </p>

              <div className="bg-blue-50 border border-blue-200 p-4 mb-8 text-left">
                <p className="text-[13px] text-blue-900 font-medium leading-relaxed">
                  <strong>Didn't receive the email?</strong> Check your spam folder or click the button below to send another link.
                </p>
              </div>

              <button
                onClick={handleBackToForm}
                className="w-full bg-blue-600 text-white py-4 font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all text-lg mb-3"
              >
                Send Another Link
              </button>

              <button
                onClick={handleBackToLogin}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 font-bold transition-all text-lg"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  return (
    <ForgotPasswordProvider>
      <ForgotPasswordInner />
    </ForgotPasswordProvider>
  );
};

export default ForgotPassword;