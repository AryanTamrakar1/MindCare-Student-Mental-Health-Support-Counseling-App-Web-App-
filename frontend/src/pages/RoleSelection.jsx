import React from "react";
import { GraduationCap, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { RoleSelectionProvider } from "../context/roleSelection/RoleSelectionContext";
import { useRoleSelectionContext } from "../context/roleSelection/RoleSelectionContext";

const RoleSelectionInner = () => {
  const { handleChoice } = useRoleSelectionContext();
  const navigate = useNavigate();
  const location = useLocation();

  const cameFromLogin = location.state?.from === "login";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-100/50 blur-3xl" />

      <div className="relative flex flex-col w-full max-w-md">
        <div className="mb-4">
          <button
            onClick={() => navigate(cameFromLogin ? "/Login" : "/")}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            {cameFromLogin ? "← Back to Login" : "← Back to Home"}
          </button>
        </div>

        <div className="relative bg-white w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-10 text-center">
            <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              Join MindCare
            </h3>
            <p className="text-gray-500 mb-10 font-medium text-sm">
              Select your account type to continue
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleChoice("Student")}
                className="w-full group p-6 flex items-center gap-5 border-2 border-blue-50 hover:border-blue-200 hover:bg-blue-50/30 transition text-left"
              >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 flex items-center justify-center">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Student</h4>
                  <p className="text-xs text-gray-400 font-medium">
                    I want to receive professional counseling.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleChoice("Counselor")}
                className="w-full group p-6 flex items-center gap-5 border-2 border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition text-left"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Counselor</h4>
                  <p className="text-xs text-gray-400 font-medium">
                    I am a professional counselor.
                  </p>
                </div>
              </button>
            </div>

            <p className="text-sm text-gray-500 font-medium mt-10">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/Login")}
                className="text-blue-600 font-black hover:text-blue-700 transition"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleSelection = () => {
  return (
    <RoleSelectionProvider>
      <RoleSelectionInner />
    </RoleSelectionProvider>
  );
};

export default RoleSelection;