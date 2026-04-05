import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { usePersonalInfoForm } from "../../hooks/profileSettings/usePersonalInfoForm";

const PersonalInfoForm = () => {
  const { user } = useContext(AuthContext);
  const { name, setName, phone, setPhone, gender, setGender, studentId, setStudentId, licenseNo, setLicenseNo, handleSaveName } = usePersonalInfoForm();

  const isStudent = user?.role === "Student";
  const isCounselor = user?.role === "Counselor";

  let showStudentId = false;
  if (isStudent) {
    showStudentId = true;
  }

  let showLicenseNo = false;
  if (isCounselor) {
    showLicenseNo = true;
  }

  return (
    <section
      className="bg-white border border-[#DBEAFE]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="px-8 py-6 border-b border-[#DBEAFE]">
        <h3 className="text-[17px] font-semibold text-[#111827]">Personal Information</h3>
        <p className="text-[14px] text-[#6B7280] mt-1">Update your personal details here</p>
      </div>

      <div className="px-8 py-7 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3.5 border border-[#BFDBFE] bg-[#F8FBFF] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
            />
          </div>

          {showStudentId && (
            <div>
              <label className="block text-[14px] font-semibold text-[#374151] mb-2.5">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                className="w-full px-4 py-3.5 border border-[#BFDBFE] bg-[#F8FBFF] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
              />
            </div>
          )}

          {showLicenseNo && (
            <div>
              <label className="block text-[14px] font-semibold text-[#374151] mb-2.5">
                License No.
              </label>
              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                placeholder="Enter your license number"
                className="w-full px-4 py-3.5 border border-[#BFDBFE] bg-[#F8FBFF] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2.5">
              Phone Number 
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3.5 border border-[#BFDBFE] bg-[#F8FBFF] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-[#374151] mb-2.5">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3.5 border border-[#BFDBFE] bg-[#F8FBFF] text-[15px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-8 pt-7 border-t border-[#EFF6FF]">
          <button
            type="button"
            onClick={handleSaveName}
            className="px-6 py-3 bg-[#2563EB] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoForm;