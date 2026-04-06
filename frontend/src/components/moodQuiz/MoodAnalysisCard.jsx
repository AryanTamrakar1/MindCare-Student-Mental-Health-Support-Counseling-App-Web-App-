import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Brain, Activity, ArrowRight } from "lucide-react";
import { useMoodAnalysis } from "../../hooks/moodQuiz/useMoodAnalysis";

function getTrendIcon(trend) {
  if (trend === "Improving") return TrendingUp;
  if (trend === "Declining") return TrendingDown;
  return Minus;
}

function getTrendColors(trend) {
  if (trend === "Improving") {
    return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" };
  }
  if (trend === "Declining") {
    return { text: "text-red-500", bg: "bg-red-50", border: "border-red-200", icon: "text-red-500" };
  }
  return { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: "text-yellow-600" };
}

function getScoreColors(score) {
  if (score >= 4) return { bar: "bg-green-500", text: "text-green-600" };
  if (score >= 3) return { bar: "bg-[#2563EB]", text: "text-[#2563EB]" };
  if (score >= 2) return { bar: "bg-yellow-500", text: "text-yellow-600" };
  return { bar: "bg-red-500", text: "text-red-500" };
}

function getScoreLabel(score) {
  if (score >= 4) return "Excellent";
  if (score >= 3) return "Good";
  if (score >= 2) return "Okay";
  return "Needs Help";
}

function getAverageColors(score) {
  if (score >= 90) return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" };
  if (score >= 80) return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" };
  if (score >= 70) return { text: "text-[#2563EB]", bg: "bg-blue-50", border: "border-blue-200", icon: "text-[#2563EB]" };
  if (score >= 60) return { text: "text-[#2563EB]", bg: "bg-blue-50", border: "border-blue-200", icon: "text-[#2563EB]" };
  if (score >= 40) return { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: "text-yellow-600" };
  return { text: "text-red-500", bg: "bg-red-50", border: "border-red-200", icon: "text-red-500" };
}

function getMoodLabel(score) {
  if (score >= 90) return "Feeling Great";
  if (score >= 80) return "Feeling Good";
  if (score >= 70) return "Doing Well";
  if (score >= 60) return "Doing Okay";
  if (score >= 40) return "Not Doing Okay";
  return "Struggling";
}

function getTrendSubtext(trend) {
  if (trend === "Improving") return "Keep up the great work!";
  if (trend === "Declining") return "Consider booking a session";
  return "You're doing well";
}

const MoodAnalysisCard = () => {
  const { analysis, loading, error } = useMoodAnalysis();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white border border-[#DBEAFE] px-8 py-8 text-center">
        <p className="text-[13px] text-[#94A3B8]">Loading your mood analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#DBEAFE] px-8 py-8 text-center">
        <p className="text-[13px] text-[#94A3B8]">Could not load mood analysis.</p>
      </div>
    );
  }

  if (!analysis.hasEnoughData) {
    return (
      <div className="bg-white border border-[#DBEAFE] px-8 py-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8]">
            <Brain size={20} strokeWidth={1.8} />
          </div>
        </div>
        <p className="text-[13px] text-[#6B7280]">{analysis.message}</p>
      </div>
    );
  }

  const trendColors = getTrendColors(analysis.trend);
  const TrendIcon = getTrendIcon(analysis.trend);
  const averageColors = getAverageColors(analysis.weightedAverage);
  const categoryNames = Object.keys(analysis.categoryAverages);

  return (
    <div className="flex flex-col gap-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="bg-white border border-[#DBEAFE] px-6 py-5 flex items-center gap-5">
          <div className={`w-12 h-12 ${averageColors.bg} border ${averageColors.border} flex items-center justify-center shrink-0`}>
            <Activity size={22} className={averageColors.icon} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Your mood this month</p>
            <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
              <p className={`text-[28px] font-bold leading-none ${averageColors.text}`}>{analysis.weightedAverage}%</p>
              <span className={`text-[18px] font-bold ${averageColors.text}`}>— {getMoodLabel(analysis.weightedAverage)}</span>
            </div>
            <p className="text-[12px] text-[#6B7280] mt-1.5">Based on your last {analysis.totalQuizzes} quizzes</p>
          </div>
        </div>

        <div className="bg-white border border-[#DBEAFE] px-6 py-5 flex items-center gap-5">
          <div className={`w-12 h-12 ${trendColors.bg} border ${trendColors.border} flex items-center justify-center shrink-0`}>
            <TrendIcon size={22} className={trendColors.icon} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Overall Trend</p>
            <p className={`text-[28px] font-bold leading-none mt-1 ${trendColors.text}`}>{analysis.trend}</p>
            <p className="text-[12px] text-[#6B7280] mt-1.5">{getTrendSubtext(analysis.trend)}</p>
          </div>
        </div>

        <div className="bg-white border border-[#DBEAFE] px-6 py-5 flex items-center gap-5">
          <div className="w-12 h-12 bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
            <Brain size={22} className="text-orange-500" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Needs Most Support</p>
            {analysis.weakestCategory && (
              <>
                <p className="text-[22px] font-bold leading-none mt-1 text-orange-500">{analysis.weakestCategory.category}</p>
                <button
                  onClick={() => navigate("/resource-library")}
                  className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:underline"
                >
                  View Resources <ArrowRight size={12} strokeWidth={2.5} />
                </button>
              </>
            )}
            {!analysis.weakestCategory && (
              <p className="text-[13px] text-[#94A3B8] mt-1">No data</p>
            )}
          </div>
        </div>

      </div>

      <div className="bg-white border border-[#DBEAFE] overflow-hidden">
        <div className="px-8 pt-6 pb-5">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-[19px] font-bold text-[#111827]">Category Breakdown</p>
              <p className="text-[14px] text-[#6B7280] mt-1">Your average score per wellness category</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500" />
                <span className="text-[12px] text-black font-bold">Excellent [4.0+]</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500" />
                <span className="text-[12px] text-black font-bold">Okay [2.0-2.9]</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#2563EB]" />
                <span className="text-[12px] text-black font-bold">Good [3.0-3.9]</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500" />
                <span className="text-[12px] text-black font-bold">Needs Help [&lt;2.0]</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-[#F1F5F9]" />
        <div className="px-8 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
            {categoryNames.map((name) => {
              const score = analysis.categoryAverages[name];
              const scoreColors = getScoreColors(score);
              const scoreLabel = getScoreLabel(score);
              const barWidth = (score / 5) * 100;
              const isWeakest =
                analysis.weakestCategory &&
                analysis.weakestCategory.category === name &&
                analysis.weakestCategory.score < 3;

              return (
                <div key={name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold text-[#374151]">{name} [{scoreLabel}]</p>
                      {isWeakest && (
                        <span className="text-[11px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 font-semibold">
                          Needs Attention
                        </span>
                      )}
                    </div>
                    <p className={"text-[13px] font-bold tabular-nums " + scoreColors.text}>{score}/5</p>
                  </div>
                  <div className="w-full bg-[#F1F5F9] h-1.5">
                    <div
                      className={scoreColors.bar + " h-1.5 transition-all duration-500"}
                      style={{ width: barWidth + "%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MoodAnalysisCard;