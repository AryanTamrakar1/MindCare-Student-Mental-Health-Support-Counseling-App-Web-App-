import React from "react";
import { TrendingUp, TrendingDown, Minus, CalendarCheck, Lightbulb } from "lucide-react";
import { useMoodPrediction } from "../../hooks/moodQuiz/useMoodPrediction";

function getOutlookContent(predictedTrend, categoryAtRisk) {
  if (predictedTrend === "Improving") {
    let subtext = "You're heading in a really good direction. Keep it up!";
    if (categoryAtRisk)
      subtext =
        "You're doing well overall, just keep an eye on your " +
        categoryAtRisk +
        " this week.";
    return {
      icon: TrendingUp,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      headline: "Things are looking up for you!",
      subtext,
    };
  }
  if (predictedTrend === "Declining") {
    let subtext =
      "Nothing serious, but it's good to be aware and take care of yourself.";
    if (categoryAtRisk)
      subtext =
        "Looks like your " +
        categoryAtRisk +
        " might need some extra attention soon.";
    return {
      icon: TrendingDown,
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconColor: "text-orange-500",
      textColor: "text-orange-600",
      headline: "Next week might feel a bit harder.",
      subtext,
    };
  }
  let subtext = "No big changes expected. Just keep doing what you're doing!";
  if (categoryAtRisk)
    subtext =
      "Your " + categoryAtRisk + " area is worth keeping an eye on though.";
  return {
    icon: Minus,
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-700",
    headline: "Next week looks pretty similar.",
    subtext,
  };
}

function getActionContent(predictedTrend) {
  if (predictedTrend === "Declining") {
    return {
      headline: "Maybe check in with a counselor?",
      message:
        "It doesn't have to be urgent — even just browsing the resource library might help you feel a bit better this week.",
    };
  }
  if (predictedTrend === "Improving") {
    return {
      headline: "You're on a good streak!",
      message:
        "Keep showing up for your weekly quiz and check-ins. Small consistent steps are what make the real difference.",
    };
  }
  return {
    headline: "Just keep showing up.",
    message:
      "Doing your weekly quiz and daily check-ins is already a great habit. Stay consistent and you'll be just fine.",
  };
}

const MoodPredictionCard = () => {
  const { prediction, loading, error } = useMoodPrediction();

  if (loading) {
    return (
      <p className="text-[13px] text-[#94A3B8] py-2">Loading your outlook...</p>
    );
  }

  if (error) {
    return (
      <p className="text-[13px] text-[#94A3B8] py-2">
        Could not load your outlook.
      </p>
    );
  }

  if (!prediction.hasEnoughData) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] shrink-0">
          <CalendarCheck size={18} strokeWidth={1.8} />
        </div>
        <p className="text-[14px] text-[#6B7280]">{prediction.message}</p>
      </div>
    );
  }

  const outlook = getOutlookContent(
    prediction.predictedTrend,
    prediction.categoryAtRisk,
  );
  const action = getActionContent(prediction.predictedTrend);
  const OutlookIcon = outlook.icon;

  return (
    <div className="grid grid-cols-2 divide-x divide-[#F1F5F9]">
      <div className="pr-8 flex items-start gap-4">
        <div
          className={`w-11 h-11 ${outlook.bg} border ${outlook.border} flex items-center justify-center shrink-0 mt-0.5`}
        >
          <OutlookIcon size={20} className={outlook.iconColor} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">
            Next Week
          </p>
          <p className={`text-[17px] font-bold leading-snug ${outlook.textColor}`}>
            {outlook.headline}
          </p>
          <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
            {outlook.subtext}
          </p>
        </div>
      </div>
      <div className="pl-8 flex items-start gap-4">
        <div className="w-11 h-11 bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={20} className="text-[#2563EB]" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">
            Our Suggestion
          </p>
          <p className="text-[17px] font-bold text-[#111827] leading-snug">
            {action.headline}
          </p>
          <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
            {action.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodPredictionCard;