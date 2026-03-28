import React, { useState } from "react";
import EmojiSlider from "./EmojiSlider";

const QuestionCard = ({ question, selected, onSelect }) => {
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);

  const handleFollowUpSelect = (option) => {
    setSelectedFollowUp(option);
    onSelect(selected, option);
  };

  return (
    <div>
      {question.category && (
        <div className="flex justify-center mb-3">
          <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 border border-[#DBEAFE] px-3 py-1 uppercase tracking-widest">
            {question.category}
          </span>
        </div>
      )}

      <h3 className="text-[17px] font-semibold text-[#111827] text-center leading-relaxed">
        {question.text}
      </h3>

      <EmojiSlider selected={selected} onSelect={onSelect} />

      {selected !== null && selected <= 2 && question.followUp && (
        <div className="mt-5 bg-[#EFF6FF] p-4 border border-[#DBEAFE]">
          <p className="text-[14px] font-semibold text-[#2563EB] mb-3">
            {question.followUp.question}
          </p>
          <div className="flex flex-col gap-2">
            {question.followUp.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleFollowUpSelect(option)}
                className={`text-left text-[13px] font-medium px-4 py-2.5 border transition-all duration-150 ${
                  selectedFollowUp === option
                    ? "bg-[#2563EB] text-white border-[#2563EB]"
                    : "bg-white text-[#374151] border-[#DBEAFE] hover:bg-[#EFF6FF] hover:border-[#2563EB]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;