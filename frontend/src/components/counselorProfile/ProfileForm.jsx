import React, { useState } from "react";
import { useProfileForm } from "../../hooks/editCounselorProfile/useProfileForm";

const ProfileForm = () => {
  const {
    profTitle,
    setProfTitle,
    experience,
    setExperience,
    bio,
    setBio,
    specializations,
    education,
    handleBioChange,
    addSpecialty,
    addDefaultSpecialty,
    removeSpecialty,
    addEducation,
    removeEducation,
    defaultSpecialties,
  } = useProfileForm();

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newEdu, setNewEdu] = useState("");

  const input =
    "w-full px-3 py-2.5 border border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111827] placeholder-[#C4C9D4] outline-none focus:bg-white focus:border-[#9CA3AF] transition-colors";

  return (
    <div className="self-stretch flex flex-col">
      <div className="bg-white border border-[#E5E7EB] flex flex-col flex-1 overflow-hidden">

        <div className="px-5 py-4 border-b border-[#F3F4F6] flex-shrink-0">
          <p className="text-[18px] font-semibold text-[#374151]">Profile information</p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-[#F3F4F6] border-b border-[#F3F4F6] flex-shrink-0">
          <div className="px-5 py-4">
            <label className="block text-[16px] font-semibold text-[#111827] mb-2">Professional title</label>
            <input
              type="text"
              value={profTitle}
              onChange={(e) => setProfTitle(e.target.value)}
              placeholder="e.g. Clinical Psychologist"
              className={input}
            />
          </div>
          <div className="px-5 py-4">
            <label className="block text-[16px] font-semibold text-[#111827] mb-2">Years of experience</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={input}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-b border-[#F3F4F6] flex flex-col flex-1 min-h-0">
          <label className="block text-[16px] font-semibold text-[#111827] mb-2 flex-shrink-0">About me</label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            placeholder="Write a brief description about yourself..."
            className={`${input} resize-none flex-1 min-h-0`}
            style={{ overflowY: "auto", minHeight: "100px" }}
          />
        </div>

        <div className="grid grid-cols-2 divide-x divide-[#F3F4F6] flex-shrink-0">

          <div className="flex flex-col border-b border-[#F3F4F6]">
            <div className="px-5 pt-4 pb-3 border-b border-[#F3F4F6]">
              <label className="block text-[16px] font-semibold text-[#111827]">Specializations</label>
            </div>
            <div className="px-5 py-3 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {defaultSpecialties.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addDefaultSpecialty(tag)}
                    className="text-[12px] px-2.5 py-1 bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] hover:bg-[#DBEAFE] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSpecialty(newSpecialty, setNewSpecialty)}
                  placeholder="Custom specialty..."
                  className={input}
                />
                <button
                  onClick={() => addSpecialty(newSpecialty, setNewSpecialty)}
                  className="px-3 py-2 bg-[#F3F4F6] text-[#374151] text-[13px] hover:bg-[#E5E7EB] transition-colors flex-shrink-0"
                >
                  Add
                </button>
              </div>
              <div
                className="flex flex-wrap gap-1.5 overflow-y-auto pr-1"
                style={{ minHeight: "32px", maxHeight: "88px" }}
              >
                {specializations.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] px-2.5 py-1 text-[12px] h-fit"
                  >
                    {s}
                    <button
                      onClick={() => removeSpecialty(s)}
                      className="text-[#93C5FD] hover:text-[#1D4ED8] text-[15px] leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col border-b border-[#F3F4F6]">
            <div className="px-5 pt-4 pb-3 border-b border-[#F3F4F6]">
              <label className="block text-[16px] font-semibold text-[#111827]">Education</label>
            </div>
            <div className="px-5 py-3 flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEdu}
                  onChange={(e) => setNewEdu(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEducation(newEdu, setNewEdu)}
                  placeholder="e.g. PhD in Psychology"
                  className={input}
                />
                <button
                  onClick={() => addEducation(newEdu, setNewEdu)}
                  className="px-3 py-2 bg-[#F3F4F6] text-[#374151] text-[13px] hover:bg-[#E5E7EB] transition-colors flex-shrink-0"
                >
                  Add
                </button>
              </div>
              <div
                className="space-y-1.5 overflow-y-auto pr-1"
                style={{ minHeight: "32px", maxHeight: "164px" }}
              >
                {education.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2.5 bg-[#F0FDF4] border border-[#BBF7D0]"
                  >
                    <span className="text-[13px] text-[#15803D] font-medium truncate mr-2">{e}</span>
                    <button
                      onClick={() => removeEducation(i)}
                      className="text-[#86EFAC] hover:text-[#15803D] text-[16px] leading-none flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileForm;