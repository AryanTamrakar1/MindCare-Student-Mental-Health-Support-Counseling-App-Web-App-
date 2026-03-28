import React from "react";
import { ThumbsDown, Frown, Meh, Smile, ThumbsUp } from "lucide-react";

const options = [
  { score: 1, icon: ThumbsDown, label: "Very Bad", activeColor: "text-red-500", activeBorder: "border-red-300", activeBg: "bg-red-50" },
  { score: 2, icon: Frown, label: "Bad", activeColor: "text-orange-500", activeBorder: "border-orange-300", activeBg: "bg-orange-50" },
  { score: 3, icon: Meh, label: "Neutral", activeColor: "text-yellow-600", activeBorder: "border-yellow-300", activeBg: "bg-yellow-50" },
  { score: 4, icon: Smile, label: "Good", activeColor: "text-[#2563EB]", activeBorder: "border-blue-300", activeBg: "bg-blue-50" },
  { score: 5, icon: ThumbsUp, label: "Very Good", activeColor: "text-green-500", activeBorder: "border-green-300", activeBg: "bg-green-50" },
];

const EmojiSlider = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-between gap-3 mt-6">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.score}
            onClick={() => onSelect(option.score)}
            className={`flex flex-col items-center flex-1 py-4 border-2 transition-all duration-200 ${
              selected === option.score
                ? `${option.activeBorder} ${option.activeBg}`
                : "border-[#E2E8F0] bg-white hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
            }`}
          >
            <Icon
              size={22}
              className={`mb-2 ${selected === option.score ? option.activeColor : "text-[#94A3B8]"}`}
              strokeWidth={selected === option.score ? 2.5 : 1.8}
            />
            <span className={`text-[13px] font-semibold ${selected === option.score ? option.activeColor : "text-[#94A3B8]"}`}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default EmojiSlider;