import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

const PasswordForm = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ currentPassword, newPassword, confirmPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const fields = [
    {
      label: "Current Password",
      value: currentPassword,
      onChange: setCurrentPassword,
      show: showCurrent,
      toggleShow: () => setShowCurrent(!showCurrent),
      placeholder: "Enter your current password",
    },
    {
      label: "New Password",
      value: newPassword,
      onChange: setNewPassword,
      show: showNew,
      toggleShow: () => setShowNew(!showNew),
      placeholder: "Minimum 8 characters",
    },
    {
      label: "Confirm New Password",
      value: confirmPassword,
      onChange: setConfirmPassword,
      show: showConfirm,
      toggleShow: () => setShowConfirm(!showConfirm),
      placeholder: "Re-enter your new password",
    },
  ];

  return (
    <section
      className="bg-white border border-[#DBEAFE] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="px-8 py-6 border-b border-[#DBEAFE]">
        <h3 className="text-[17px] font-semibold text-[#111827]">Security & Password</h3>
        <p className="text-[14px] text-[#6B7280] mt-1">Manage your password and security settings</p>
      </div>

      <div className="px-8 py-7">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {fields.map(({ label, value, onChange, show, toggleShow, placeholder }) => {
              let inputType = "password";
              if (show) {
                inputType = "text";
              }

              let iconComponent = <Eye size={17} strokeWidth={2} />;
              if (show) {
                iconComponent = <EyeOff size={17} strokeWidth={2} />;
              }

              return (
                <div key={label}>
                  <label className="block text-[14px] font-semibold text-[#374151] mb-2.5">
                    {label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <KeyRound size={15} className="text-[#BFDBFE]" strokeWidth={2} />
                    </div>
                    <input
                      type={inputType}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-12 py-3.5 border border-[#BFDBFE] bg-[#F8FBFF] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={toggleShow}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#2563EB] transition-colors"
                    >
                      {iconComponent}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 pt-6 border-t border-[#EFF6FF]">
            <button
              type="submit"
              className="px-6 py-3 bg-[#2563EB] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PasswordForm;