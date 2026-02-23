import React from "react";

const options = [
  { score: 1, emoji: "😞", label: "Very Bad" },
  { score: 2, emoji: "😟", label: "Bad" },
  { score: 3, emoji: "😐", label: "Neutral" },
  { score: 4, emoji: "🙂", label: "Good" },
  { score: 5, emoji: "😊", label: "Very Good" },
];

const EmojiSlider = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-between gap-3 mt-6">
      {options.map((option) => (
        <button
          key={option.score}
          onClick={() => onSelect(option.score)}
          className={`flex flex-col items-center flex-1 py-4 rounded-2xl border-2 transition-all duration-200
            ${selected === option.score
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
            }`}
        >
          <span className="text-3xl mb-2">{option.emoji}</span>
          <span className={`text-xs font-bold ${selected === option.score ? "text-blue-600" : "text-gray-400"}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default EmojiSlider;