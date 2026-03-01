import React, { useState } from "react";
import { Mail, ChevronDown, ChevronUp, Inbox } from "lucide-react";

const MilestoneLetters = ({ letters }) => {
  const [openIndex, setOpenIndex] = useState(null);

  function handleToggle(index) {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function renderEmpty() {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Inbox className="w-10 h-10 text-gray-300" />
        <p className="text-sm font-bold text-gray-400 text-center">
          No letters yet
        </p>
        <p className="text-xs text-gray-400 text-center font-medium">
          Earn badges to receive personal milestone letters here
        </p>
      </div>
    );
  }

  const sortedLetters = letters.slice().sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-gray-800 uppercase tracking-widest">
          Letters to Myself
        </p>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {letters.length} {letters.length === 1 ? "letter" : "letters"}
        </span>
      </div>

      {letters.length === 0 && renderEmpty()}

      {letters.length > 0 && (
        <div className="flex flex-col gap-3">
          {sortedLetters.map(function (letter, index) {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={function () {
                    handleToggle(index);
                  }}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-gray-800">
                        {letter.badgeName} Badge
                      </p>
                      <p className="text-xs text-gray-400 font-semibold">
                        {formatDate(letter.createdAt)}
                      </p>
                    </div>
                  </div>
                  {isOpen && (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                  {!isOpen && (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="bg-indigo-50 rounded-xl p-4 mt-3">
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">
                        {letter.letterText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MilestoneLetters;
