import { Camera, ShieldCheck, CalendarDays, Clock, UserCircle, Mail, User, Phone, Users, FileText } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const formatDob = (dob) => {
  if (!dob) return "Not provided";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Not available";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const AccountOverview = ({ currentUser, onPhotoUpload, getProfilePhotoUrl }) => {
  const { user } = useContext(AuthContext);
  const isStudent = user?.role === "Student";
  const isCounselor = user?.role === "Counselor";

  const baseStats = [
    {
      icon: User,
      label: "Full Name",
      value: currentUser.name,
    },
    {
      icon: Mail,
      label: "Email",
      value: currentUser.email,
      truncate: true,
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: currentUser.phone || "Not provided",
    },
  ];

  if (isStudent) {
    baseStats.push({
      icon: FileText,
      label: "Student ID",
      value: currentUser.studentId || "Not provided",
    });
  }

  if (isCounselor) {
    baseStats.push({
      icon: FileText,
      label: "License No.",
      value: currentUser.licenseNo || "Not provided",
    });
  }

  if (isStudent) {
    baseStats.push({
      icon: CalendarDays,
      label: "Date of Birth",
      value: formatDob(currentUser.dob),
    });
  }

  baseStats.push({
    icon: Users,
    label: "Gender",
    value: currentUser.gender || "Not provided",
  });

  baseStats.push({
    icon: UserCircle,
    label: "System Role",
    custom: (
      <span className="px-2.5 py-0.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[13px] font-semibold capitalize">
        {currentUser.role}
      </span>
    ),
  });

  baseStats.push({
    icon: CalendarDays,
    label: "Member Since",
    value: formatDate(currentUser.createdAt),
  });

  baseStats.push({
    icon: Clock,
    label: "Last Login",
    value: formatDate(currentUser.lastLogin),
  });

  baseStats.push({
    icon: ShieldCheck,
    label: "Account Status",
    custom: (
      <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#16A34A]">
        <span className="w-2 h-2 bg-[#16A34A]" />
        Verified
      </span>
    ),
  });

  return (
    <section
      className="bg-white border border-[#DBEAFE] overflow-hidden flex flex-col flex-1"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="px-7 py-5 border-b border-[#DBEAFE]">
        <h3 className="text-[16px] font-semibold text-[#111827]">Account Overview</h3>
        <p className="text-[13px] text-[#6B7280] mt-0.5">Your account information and status</p>
      </div>

      <div className="px-7 py-6 flex flex-col flex-1">
        <div className="flex flex-col items-center gap-3 pb-5 border-b border-[#EFF6FF]">
          <div className="relative">
            <img
              src={getProfilePhotoUrl()}
              alt="Profile"
              className="w-20 h-20 object-cover border-2 border-[#BFDBFE] rounded-full"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "User")}&background=2563EB&color=fff&size=200`;
              }}
            />
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-[#1D4ED8] transition-colors border-2 border-white rounded-full">
              <Camera size={13} className="text-white" strokeWidth={2} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onPhotoUpload}
              />
            </label>
          </div>
          <div className="text-center">
            <p className="text-[15px] font-bold text-[#111827]">{currentUser.name}</p>
            <p className="text-[13px] text-[#6B7280] mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="pt-3 flex flex-col flex-1 justify-between">
          {baseStats.map(({ icon: Icon, label, value, custom, truncate }, i) => {
            let borderClass = "";
            if (i < baseStats.length - 1) {
              borderClass = "border-b border-[#EFF6FF]";
            }

            let textClass = "text-[13px] font-semibold text-[#111827] text-right";
            if (truncate) {
              textClass = textClass + " truncate max-w-[120px]";
            }

            return (
              <div
                key={`${label}-${i}`}
                className={`flex items-center justify-between gap-3 ${borderClass} ${isStudent ? "py-2" : "py-3"}`}
              >
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="w-7 h-7 bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-[#2563EB]" strokeWidth={2} />
                  </div>
                  <span className="text-[13px] text-[#6B7280] font-medium whitespace-nowrap">{label}</span>
                </div>
                {custom || (
                  <span className={textClass}>
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AccountOverview;