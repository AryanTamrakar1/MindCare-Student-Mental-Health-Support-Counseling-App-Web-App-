import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CalendarCheck,
  Lightbulb,
} from "lucide-react";
import API from "../../api/axios";

function getOutlookContent(predictedTrend, categoryAtRisk, isCrisisRisk) {
  if (isCrisisRisk) {
    let subtext = "Please don't ignore how you're feeling right now.";
    if (categoryAtRisk) {
      subtext =
        "Your " +
        categoryAtRisk +
        " has been struggling a lot. Please don't ignore how you're feeling.";
    }
    return {
      icon: AlertTriangle,
      bg: "bg-red-50",
      iconColor: "text-red-500",
      textColor: "text-red-500",
      headline: "Hey, next week looks really tough.",
      subtext,
    };
  }

  if (predictedTrend === "Improving") {
    let subtext = "You're heading in a really good direction. Keep it up!";
    if (categoryAtRisk) {
      subtext =
        "You're doing well overall, just keep an eye on your " +
        categoryAtRisk +
        " this week.";
    }
    return {
      icon: TrendingUp,
      bg: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-600",
      headline: "Things are looking up for you!",
      subtext,
    };
  }

  if (predictedTrend === "Declining") {
    let subtext =
      "Nothing serious, but it's good to be aware and take care of yourself.";
    if (categoryAtRisk) {
      subtext =
        "Looks like your " +
        categoryAtRisk +
        " might need some extra attention soon.";
    }
    return {
      icon: TrendingDown,
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
      textColor: "text-orange-500",
      headline: "Next week might feel a bit harder.",
      subtext,
    };
  }

  let subtext = "No big changes expected. Just keep doing what you're doing!";
  if (categoryAtRisk) {
    subtext =
      "Your " + categoryAtRisk + " area is worth keeping an eye on though.";
  }
  return {
    icon: Minus,
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-600",
    headline: "Next week looks pretty similar.",
    subtext,
  };
}

function getActionContent(predictedTrend, isCrisisRisk) {
  if (isCrisisRisk) {
    return {
      headline: "Please talk to someone.",
      message:
        "Book a session with a counselor this week. You don't have to figure everything out alone — that's what they're here for.",
    };
  }

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
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-prediction", {
          headers: { Authorization: "Bearer " + token },
        });
        setPrediction(res.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">Loading your outlook...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">Could not load your outlook.</p>
      </div>
    );
  }

  if (!prediction.hasEnoughData) {
    return (
      <div className="flex flex-col gap-4">
        {prediction.isCrisisRisk && (
          <div className="bg-red-50 border border-black/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-600">
                Hey, we are worried about you
              </p>
              <p className="text-xs text-red-400 mt-0.5">
                You have been feeling low for 3 days in a row. Please consider
                talking to a counselor.
              </p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
              <CalendarCheck size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500">{prediction.message}</p>
        </div>
      </div>
    );
  }

  const outlook = getOutlookContent(
    prediction.predictedTrend,
    prediction.categoryAtRisk,
    prediction.isCrisisRisk,
  );

  const action = getActionContent(
    prediction.predictedTrend,
    prediction.isCrisisRisk,
  );

  const OutlookIcon = outlook.icon;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-black/10 p-5 flex items-start gap-4">
        <div
          className={
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " +
            outlook.bg
          }
        >
          <OutlookIcon size={22} className={outlook.iconColor} />
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Next Week
          </p>
          <p className={"text-base font-black " + outlook.textColor}>
            {outlook.headline}
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {outlook.subtext}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/10 p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Lightbulb size={22} className="text-blue-500" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Our Suggestion
          </p>
          <p className="text-base font-black text-gray-800">
            {action.headline}
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {action.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodPredictionCard;
