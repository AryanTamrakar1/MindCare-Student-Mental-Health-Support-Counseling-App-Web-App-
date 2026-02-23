import React from "react";

const ProgressBar = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-500">
          Question {current} of {total}
        </span>
        <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;