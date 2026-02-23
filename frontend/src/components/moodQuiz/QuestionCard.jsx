import React from "react";
import EmojiSlider from "./EmojiSlider";

const QuestionCard = ({ question, selected, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
        {question.text}
      </h3>

      {question.category && (
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-center mb-4">
          {question.category}
        </p>
      )}

      <EmojiSlider selected={selected} onSelect={onSelect} />

      {selected !== null && selected <= 2 && question.followUp && (
        <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-sm font-bold text-indigo-700 mb-3">
            {question.followUp.question}
          </p>
          <div className="flex flex-col gap-2">
            {question.followUp.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onSelect(selected, option)}
                className="text-left text-sm font-semibold text-gray-700 bg-white border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
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