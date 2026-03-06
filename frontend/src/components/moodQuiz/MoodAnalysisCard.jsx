import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Brain,
  BarChart2,
  Activity,
} from "lucide-react";
import API from "../../api/axios";

function getTrendIcon(trend) {
  if (trend === "Improving") return TrendingUp;
  if (trend === "Declining") return TrendingDown;
  return Minus;
}

function getTrendColors(trend) {
  if (trend === "Improving") {
    return {
      text: "text-green-600",
      bg: "bg-green-50",
      icon: "text-green-600",
    };
  }
  if (trend === "Declining") {
    return { text: "text-red-500", bg: "bg-red-50", icon: "text-red-500" };
  }
  return {
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
  };
}

function getScoreColors(score) {
  if (score >= 4) return { bar: "bg-green-500", text: "text-green-600" };
  if (score >= 3) return { bar: "bg-blue-500", text: "text-blue-600" };
  if (score >= 2) return { bar: "bg-yellow-500", text: "text-yellow-600" };
  return { bar: "bg-red-500", text: "text-red-500" };
}

function getAverageColors(score) {
  if (score >= 70)
    return {
      text: "text-green-600",
      bg: "bg-green-50",
      icon: "text-green-600",
    };
  if (score >= 50)
    return { text: "text-blue-600", bg: "bg-blue-50", icon: "text-blue-600" };
  if (score >= 30)
    return {
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
    };
  return { text: "text-red-500", bg: "bg-red-50", icon: "text-red-500" };
}

function getTrendSubtext(trend) {
  if (trend === "Improving") return "Keep up the great work!";
  if (trend === "Declining") return "Consider booking a session";
  return "You're doing well";
}

const MoodAnalysisCard = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-analysis", {
          headers: { Authorization: "Bearer " + token },
        });
        setAnalysis(res.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">Loading your mood analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">Could not load mood analysis.</p>
      </div>
    );
  }

  if (!analysis.hasEnoughData) {
    return (
      <div className="flex flex-col gap-4">
        {analysis.isCrisis && (
          <div className="bg-red-50 border border-black/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-600">
                Your mood needs attention
              </p>
              <p className="text-xs text-red-400 mt-0.5">
                We recommend booking a session with a counselor this week.
              </p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
              <Brain size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500">{analysis.message}</p>
        </div>
      </div>
    );
  }

  const trendColors = getTrendColors(analysis.trend);
  const TrendIcon = getTrendIcon(analysis.trend);
  const averageColors = getAverageColors(analysis.weightedAverage);
  const categoryNames = Object.keys(analysis.categoryAverages);

  return (
    <div className="flex flex-col gap-4">
      {analysis.isCrisis && (
        <div className="bg-red-50 border border-black/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-600">
              Your mood needs attention
            </p>
            <p className="text-xs text-red-400 mt-0.5">
              We recommend booking a session with a counselor this week.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-black/10 p-5 flex items-center gap-4">
          <div
            className={
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " +
              averageColors.bg
            }
          >
            <Activity size={22} className={averageColors.icon} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Weighted Average
            </p>
            <p className={"text-2xl font-black mt-1 " + averageColors.text}>
              {analysis.weightedAverage}%
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Based on last {analysis.totalQuizzes} quizzes
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 flex items-center gap-4">
          <div
            className={
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " +
              trendColors.bg
            }
          >
            <TrendIcon size={22} className={trendColors.icon} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Overall Trend
            </p>
            <p className={"text-2xl font-black mt-1 " + trendColors.text}>
              {analysis.trend}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {getTrendSubtext(analysis.trend)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Brain size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Needs Most Support
            </p>
            {analysis.weakestCategory && (
              <>
                <p className="text-2xl font-black mt-1 text-orange-500">
                  {analysis.weakestCategory.category}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Avg score: {analysis.weakestCategory.score}/5
                </p>
              </>
            )}
            {!analysis.weakestCategory && (
              <p className="text-sm text-gray-400 mt-1">No data</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-black/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <BarChart2 size={16} className="text-blue-500" />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            How You're Doing In Each Area
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {categoryNames.map((name) => {
            const score = analysis.categoryAverages[name];
            const scoreColors = getScoreColors(score);
            const barWidth = (score / 5) * 100;

            const isWeakest =
              analysis.weakestCategory &&
              analysis.weakestCategory.category === name &&
              analysis.weakestCategory.score < 3;

            return (
              <div key={name} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700 font-semibold">
                      {name}
                    </p>
                    {isWeakest && (
                      <span className="text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full font-semibold">
                        Needs Attention
                      </span>
                    )}
                  </div>
                  <p className={"text-sm font-black " + scoreColors.text}>
                    {score}/5
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={
                      scoreColors.bar +
                      " h-2 rounded-full transition-all duration-500"
                    }
                    style={{ width: barWidth + "%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodAnalysisCard;
