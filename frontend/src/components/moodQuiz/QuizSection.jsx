import React from "react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import { useQuizSection } from "../../hooks/moodQuiz/useQuizSection";

function getScoreColor(score) {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-green-500";
  if (score >= 70) return "text-blue-600";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBg(score) {
  if (score >= 90) return "bg-green-50 border border-green-200";
  if (score >= 80) return "bg-green-100 border border-green-300";
  if (score >= 70) return "bg-blue-50 border border-blue-200";
  if (score >= 60) return "bg-blue-100 border border-blue-300";
  if (score >= 40) return "bg-yellow-50 border border-yellow-200";
  return "bg-red-50 border border-red-200";
}

function getMoodLabel(score) {
  if (score >= 90) return "Feeling Great";
  if (score >= 80) return "Feeling Good";
  if (score >= 70) return "Doing Well";
  if (score >= 60) return "Doing Okay";
  if (score >= 40) return "Not Doing Okay";
  return "Struggling";
}

const QuizSection = ({ onQuizComplete }) => {
  const {
    questions,
    currentIndex,
    selectedScore,
    alreadySubmitted,
    submitted,
    result,
    loading,
    checking,
    handleSelect,
    handleNext,
  } = useQuizSection();

  if (checking || loading) {
    let loadingText = "Submitting your quiz...";
    if (checking) loadingText = "Loading your quiz...";

    return (
      <p className="text-[13px] text-[#94A3B8] text-center py-2">
        {loadingText}
      </p>
    );
  }

  if (alreadySubmitted && !submitted) {
    return (
      <div className="flex items-center justify-between gap-8">
        <div>
          <p className="text-[14px] font-semibold text-[#374151] mb-1">
            You already completed this week's quiz.
          </p>
          <p className="text-[13px] text-[#6B7280]">
            Come back next week for a new one.
          </p>
        </div>
        {result && (
          <div className={"text-center px-8 py-4 shrink-0 " + getScoreBg(result.moodScore)}>
            <p className="text-[12px] font-semibold text-[#6B7280] mb-2">Your current mood this week</p>
            <div className="flex items-baseline gap-1.5 justify-center">
              <p className={`text-[28px] font-bold tabular-nums ${getScoreColor(result.moodScore)}`}>{result.moodScore}%</p>
              <span className={`text-[28px] font-bold ${getScoreColor(result.moodScore)}`}>— {getMoodLabel(result.moodScore)}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-between gap-8">
        <div>
          <p className="text-[14px] font-semibold text-[#374151] mb-1">
            Quiz completed! Your response has been recorded.
          </p>
          <p className="text-[13px] text-[#6B7280]">See you next week.</p>
        </div>
        {result && (
          <div className={"text-center px-8 py-4 shrink-0 " + getScoreBg(result.moodScore)}>
            <p className="text-[12px] font-semibold text-[#6B7280] mb-2">Your current mood this week</p>
            <div className="flex items-baseline gap-1.5 justify-center">
              <p className={`text-[28px] font-bold tabular-nums ${getScoreColor(result.moodScore)}`}>{result.moodScore}%</p>
              <span className={`text-[28px] font-bold ${getScoreColor(result.moodScore)}`}>— {getMoodLabel(result.moodScore)}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-[13px] text-[#94A3B8] text-center py-2">
        Could not load quiz questions.
      </p>
    );
  }

  let buttonText = "Next Question";
  if (currentIndex + 1 === questions.length) buttonText = "Submit Quiz";

  return (
    <div>
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      <QuestionCard
        question={questions[currentIndex]}
        selected={selectedScore}
        onSelect={handleSelect}
      />
      <button
        onClick={handleNext}
        disabled={selectedScore === null}
        className="mt-6 w-full bg-[#2563EB] text-white py-3 font-semibold text-[14px] hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default QuizSection;