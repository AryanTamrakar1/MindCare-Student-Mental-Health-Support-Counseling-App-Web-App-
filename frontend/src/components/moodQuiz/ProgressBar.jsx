import React from "react";

const ProgressBar = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] font-semibold text-[#6B7280]">
          Question {current} of {total}
        </span>
        <span className="text-[13px] font-bold text-[#2563EB]">{percentage}%</span>
      </div>
      <div className="w-full bg-[#F1F5F9] h-1.5">
        <div
          className="bg-[#2563EB] h-1.5 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;