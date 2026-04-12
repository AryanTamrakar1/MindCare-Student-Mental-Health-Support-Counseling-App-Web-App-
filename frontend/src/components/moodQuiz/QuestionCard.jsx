import React from "react";
import EmojiSlider from "./EmojiSlider";

const QuestionCard = ({ question, selected, onSelect }) => {
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
    </div>
  );
};

export default QuestionCard;