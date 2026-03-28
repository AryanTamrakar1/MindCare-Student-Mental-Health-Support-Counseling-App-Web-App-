import React from "react";
import { ThumbsDown, Frown, Meh, Smile, ThumbsUp } from "lucide-react";
import { useDailyCheckIn } from "../../hooks/moodQuiz/useDailyCheckIn";

const DailyCheckIn = () => {
  const { selected, setSelected, submitted, loading, alreadyDone, handleSubmit } = useDailyCheckIn();

  const emojis = [
    { mood: 1, icon: ThumbsDown, label: "Very Bad", activeColor: "text-red-500", activeBorder: "border-red-300", activeBg: "bg-red-50" },
    { mood: 2, icon: Frown, label: "Bad", activeColor: "text-orange-500", activeBorder: "border-orange-300", activeBg: "bg-orange-50" },
    { mood: 3, icon: Meh, label: "Okay", activeColor: "text-yellow-600", activeBorder: "border-yellow-300", activeBg: "bg-yellow-50" },
    { mood: 4, icon: Smile, label: "Good", activeColor: "text-[#2563EB]", activeBorder: "border-blue-300", activeBg: "bg-blue-50" },
    { mood: 5, icon: ThumbsUp, label: "Great", activeColor: "text-green-500", activeBorder: "border-green-300", activeBg: "bg-green-50" },
  ];

  if (alreadyDone || submitted) {
    let checkInStatusText = "Check-in saved!";
    if (alreadyDone) checkInStatusText = "You already checked in today!";

    return (
      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-[#6B7280] mb-1">
          {checkInStatusText}
        </p>
        {emojis.map((item) => {
          const Icon = item.icon;
          const isSelected = selected === item.mood;
          return (
            <div
              key={item.mood}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                isSelected
                  ? `${item.activeBorder} ${item.activeBg}`
                  : "border-[#F1F5F9] bg-[#F8FAFC] opacity-40"
              }`}
            >
              <Icon
                size={17}
                className={isSelected ? item.activeColor : "text-[#94A3B8]"}
                strokeWidth={isSelected ? 2.5 : 1.8}
              />
              <span className={`text-[13px] font-medium ${isSelected ? item.activeColor : "text-[#94A3B8]"}`}>
                {item.label}
              </span>
              {isSelected && (
                <span className="ml-auto text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Today
                </span>
              )}
            </div>
          );
        })}
        <p className="text-[12px] text-[#94A3B8] text-center mt-2">See you tomorrow.</p>
      </div>
    );
  }

  let submitButtonText = "Submit Check-In";
  if (loading) submitButtonText = "Saving...";

  return (
    <div>
      <p className="text-[13px] text-[#6B7280] mb-4">How are you feeling today?</p>
      <div className="flex flex-col gap-2 mb-4">
        {emojis.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.mood}
              onClick={() => setSelected(item.mood)}
              className={`flex items-center gap-3 w-full px-4 py-3 border-2 transition-all duration-200 text-left ${
                selected === item.mood
                  ? `${item.activeBorder} ${item.activeBg}`
                  : "border-[#E2E8F0] bg-white hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
              }`}
            >
              <Icon
                size={17}
                className={`shrink-0 ${selected === item.mood ? item.activeColor : "text-[#94A3B8]"}`}
                strokeWidth={selected === item.mood ? 2.5 : 1.8}
              />
              <span className={`text-[13px] font-medium ${selected === item.mood ? item.activeColor : "text-[#374151]"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || loading}
        className="w-full bg-[#2563EB] text-white py-2.5 text-[13px] font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitButtonText}
      </button>
    </div>
  );
};

export default DailyCheckIn;