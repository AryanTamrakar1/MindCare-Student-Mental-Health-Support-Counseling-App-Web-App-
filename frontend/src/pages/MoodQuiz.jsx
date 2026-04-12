import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ThumbsDown,
  Frown,
  Meh,
  Smile,
  ThumbsUp,
} from "lucide-react";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import DailyCheckIn from "../components/moodQuiz/DailyCheckIn";
import QuizSection from "../components/moodQuiz/QuizSection";
import MoodGraph from "../components/moodQuiz/MoodGraph";
import MoodAnalysisCard from "../components/moodQuiz/MoodAnalysisCard";
import MoodPredictionCard from "../components/moodQuiz/MoodPredictionCard";
import { MoodQuizProvider } from "../context/moodQuiz/MoodQuizContext";
import { DailyCheckInProvider } from "../context/moodQuiz/DailyCheckInContext";
import { MoodAnalysisProvider } from "../context/moodQuiz/MoodAnalysisContext";
import { MoodPredictionProvider } from "../context/moodQuiz/MoodPredictionContext";
import { QuizSectionProvider } from "../context/moodQuiz/QuizSectionContext";
import { useMoodQuiz } from "../hooks/moodQuiz/useMoodQuiz";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const shortNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toLocalDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function parseDateLabel(dateStr) {
  const parts = dateStr.split(" ");
  const day = parseInt(parts[0]);
  const month = monthNames.indexOf(parts[1]);
  const year = parseInt(parts[2]);
  return new Date(year, month, day);
}

function getMoodLabel(score) {
  if (score >= 90) return "Feeling Great";
  if (score >= 80) return "Feeling Good";
  if (score >= 70) return "Doing Well";
  if (score >= 60) return "Doing Okay";
  if (score >= 40) return "Not Doing Okay";
  return "Struggling";
}

function weekLabelToDateRange(weekLabel) {
  for (let i = 0; i < monthNames.length; i++) {
    if (weekLabel.includes(monthNames[i])) {
      const dayStr = weekLabel.split(" ")[0];
      const day = parseInt(dayStr);
      const yearStr = weekLabel.split(" ")[2];
      const year = parseInt(yearStr);

      const monday = new Date(year, i, day);
      const sunday = new Date(year, i, day + 6);

      const mondayDay = monday.getDate();
      const sundayDay = sunday.getDate();
      const sundayMonth = sunday.getMonth();

      const fmt1 = mondayDay + " " + shortNames[i] + " " + year;
      const fmt2 = sundayDay + " " + shortNames[sundayMonth] + " " + year;

      return fmt1 + " - " + fmt2;
    }
  }
  return weekLabel;
}

const moodIconMap = {
  1: {
    icon: ThumbsDown,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    dayColor: "text-red-600",
  },
  2: {
    icon: Frown,
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200",
    dayColor: "text-orange-600",
  },
  3: {
    icon: Meh,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    dayColor: "text-yellow-700",
  },
  4: {
    icon: Smile,
    color: "text-[#2563EB]",
    bg: "bg-blue-50 border-blue-200",
    dayColor: "text-[#2563EB]",
  },
  5: {
    icon: ThumbsUp,
    color: "text-green-500",
    bg: "bg-green-50 border-green-200",
    dayColor: "text-green-600",
  },
};

const moodMap = {
  1: {
    emoji: "😔",
    label: "Really struggling",
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
  },
  2: {
    emoji: "😟",
    label: "Not doing okay",
    bg: "bg-orange-50",
    text: "text-orange-500",
    border: "border-orange-100",
  },
  3: {
    emoji: "😐",
    label: "Doing okay",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-100",
  },
  4: {
    emoji: "🙂",
    label: "Doing well",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  5: {
    emoji: "😊",
    label: "Feeling good",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
  },
};

const MoodQuizInner = () => {
  const {
    user,
    history,
    checkIns,
    expandedId,
    setExpandedId,
    today,
    todayStr,
    calendarDate,
    handleQuizComplete,
    prevMonth,
    nextMonth,
  } = useMoodQuiz();
  const navigate = useNavigate();

  function getBadgeColor(score) {
    if (score >= 90) return "bg-green-50 text-green-600 border border-green-200";
    if (score >= 80) return "bg-green-50 text-green-600 border border-green-200";
    if (score >= 70) return "bg-blue-50 text-[#2563EB] border border-blue-200";
    if (score >= 60) return "bg-blue-50 text-[#2563EB] border border-blue-200";
    if (score >= 40) return "bg-yellow-50 text-yellow-600 border border-yellow-200";
    return "bg-red-50 text-red-500 border border-red-200";
  }

  function getDateFromLabel(label) {
    return parseDateLabel(label);
  }

  const sortedHistory = history.slice().sort((a, b) => {
    return getDateFromLabel(a.weekLabel) - getDateFromLabel(b.weekLabel);
  });

  const checkInMap = {};
  for (let i = 0; i < checkIns.length; i++) {
    const parsed = parseDateLabel(checkIns[i].date);
    const key = toLocalDateString(parsed);
    checkInMap[key] = checkIns[i];
  }

  const calMonthLabel = new Date(
    calendarDate.year,
    calendarDate.month,
    1,
  ).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(calendarDate.year, calendarDate.month, 1).getDay();
  const daysInMonth = new Date(
    calendarDate.year,
    calendarDate.month + 1,
    0,
  ).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  if (!user) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF] flex"
    >
      <Navbar />
      <StudentSidebar user={user} />

      <main className="flex-1 ml-[260px] pt-[96px] px-8 pb-10 overflow-y-auto">
        <MoodAnalysisCard />

        <div className="bg-white border border-[#DBEAFE] overflow-hidden mt-5">
          <div className="px-8 pt-7 pb-5">
            <p className="text-[19px] font-bold text-[#111827]">
              Mood Prediction
            </p>
            <p className="text-[14px] text-[#6B7280] mt-1">
              Your outlook for next week
            </p>
          </div>
          <div className="h-px w-full bg-[#F1F5F9]" />
          <div className="px-8 py-6">
            <MoodPredictionCard />
          </div>
        </div>

        <div className="bg-white border border-[#DBEAFE] overflow-hidden mt-5">
          <div className="px-8 pt-7 pb-5 flex justify-between items-start">
            <div>
              <p className="text-[19px] font-bold text-[#111827]">
                Weekly Quiz
              </p>
              <p className="text-[14px] text-[#6B7280] mt-1">
                Answer a few questions about how you've been feeling
              </p>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-600" />
                  <span className="text-[12px] text-black font-bold">
                    [90% +]: Feeling Great
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500" />
                  <span className="text-[12px] text-black font-bold">
                    [80-89%]: Feeling Good
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600" />
                  <span className="text-[12px] text-black font-bold">
                    [70-79%]: Doing Well
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500" />
                  <span className="text-[12px] text-black font-bold">
                    [60-69%]: Doing Okay
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-600" />
                  <span className="text-[12px] text-black font-bold">
                    [40-59%]: Not Doing Okay
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600" />
                  <span className="text-[12px] text-black font-bold">
                    [Below 40%]: Struggling
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-[#F1F5F9]" />
          <div className="px-8 py-6">
            <QuizSection onQuizComplete={handleQuizComplete} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 items-stretch">
          <div className="bg-white border border-[#DBEAFE] overflow-hidden flex flex-col h-full">
            <div className="px-6 pt-6 pb-4 shrink-0">
              <p className="text-[17px] font-bold text-[#111827]">
                Daily Check-In
              </p>
              <p className="text-[13px] text-[#6B7280] mt-1">
                Log how you're feeling today
              </p>
            </div>
            <div className="h-px w-full bg-[#F1F5F9] shrink-0" />
            <div className="px-6 py-5 flex flex-col flex-1">
              <DailyCheckIn />
            </div>
          </div>

          <div className="bg-white border border-[#DBEAFE] overflow-hidden flex flex-col h-full">
            <div className="px-6 pt-6 pb-4 shrink-0 flex items-start justify-between">
              <div>
                <p className="text-[17px] font-bold text-[#111827]">
                  Check-In Calendar
                </p>
                <p className="text-[13px] text-[#6B7280] mt-1">
                  Your daily mood log at a glance
                </p>
              </div>
              <div className="flex items-center gap-0.5 mt-1">
                <button
                  onClick={prevMonth}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#F1F5F9] text-[#6B7280] transition"
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                </button>
                <span className="text-[12px] font-semibold text-[#374151] mx-1.5 whitespace-nowrap">
                  {calMonthLabel}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#F1F5F9] text-[#6B7280] transition"
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="h-px w-full bg-[#F1F5F9] shrink-0" />
            <div className="px-4 py-4 flex flex-col flex-1">
              <div className="grid grid-cols-7 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    className="flex items-center justify-center pb-1"
                  >
                    <span className="text-[11px] font-semibold text-[#94A3B8]">
                      {d}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="grid grid-cols-7 flex-1"
                style={{
                  gridTemplateRows: `repeat(${Math.ceil(calendarCells.length / 7)}, 1fr)`,
                }}
              >
                {calendarCells.map((day, idx) => {
                  if (day === null) return <div key={"empty-" + idx} />;
                  const d = new Date(
                    calendarDate.year,
                    calendarDate.month,
                    day,
                  );
                  const key = toLocalDateString(d);
                  const isToday = key === todayStr;
                  const isFuture = d > today;
                  const entry = checkInMap[key];
                  const mood = entry ? moodMap[entry.mood] : null;
                  const moodCfg = entry ? moodIconMap[entry.mood] : null;
                  const MoodIcon = moodCfg ? moodCfg.icon : null;

                  let cellClass =
                    "flex flex-col items-center justify-center border transition-all m-0.5 gap-0.5";
                  if (mood)
                    cellClass =
                      cellClass + " " + mood.bg + " border " + mood.border;
                  else if (isToday)
                    cellClass = cellClass + " bg-[#EFF6FF] border-[#DBEAFE]";
                  else cellClass = cellClass + " border-transparent";
                  if (isFuture) cellClass = cellClass + " opacity-30";

                  let dayTextClass = "text-[13px] font-bold leading-none ";
                  if (mood) dayTextClass = dayTextClass + mood.text;
                  else if (isToday)
                    dayTextClass = dayTextClass + "text-[#2563EB]";
                  else dayTextClass = dayTextClass + "text-[#94A3B8]";

                  return (
                    <div key={key} className={cellClass}>
                      <span className={dayTextClass}>{day}</span>
                      {MoodIcon && (
                        <MoodIcon
                          size={13}
                          className={`mt-1 ${moodCfg.color}`}
                          strokeWidth={2}
                        />
                      )}
                      {!mood && isToday && (
                        <div className="w-1 h-1 bg-[#2563EB] mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="h-px w-full bg-[#F1F5F9] mt-4 mb-3 shrink-0" />
              <div className="flex items-center gap-4 flex-wrap shrink-0">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                  Key Details
                </p>
                {Object.entries(moodIconMap).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  const labels = {
                    1: "Really struggling",
                    2: "Not doing okay",
                    3: "Doing okay",
                    4: "Doing well",
                    5: "Feeling good",
                  };
                  return (
                    <div key={key} className="flex items-center gap-1.5">
                      <Icon size={12} className={cfg.color} strokeWidth={2} />
                      <span className="text-[12px] text-[#6B7280]">
                        {labels[key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DBEAFE] overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-4 shrink-0">
              <p className="text-[17px] font-bold text-[#111827]">
                Past Quiz Results
              </p>
              <p className="text-[13px] text-[#6B7280] mt-1">
                Your weekly mood scores over time
              </p>
            </div>
            <div className="h-px w-full bg-[#F1F5F9] shrink-0" />
            <div
              className="px-4 py-4 overflow-y-auto"
              style={{ height: "360px" }}
            >
              {sortedHistory.length === 0 && (
                <p className="text-[13px] text-[#94A3B8] text-center py-8">
                  No quiz results yet.
                </p>
              )}
              {sortedHistory.length > 0 && (
                <div className="flex flex-col gap-2">
                  {sortedHistory.map((entry) => {
                    return (
                      <div
                        key={entry._id}
                        className="flex items-center justify-between gap-2 px-4 py-3.5 border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition shrink-0"
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#111827] truncate">
                            {weekLabelToDateRange(entry.weekLabel)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={
                              "text-[12px] font-semibold px-2.5 py-1 whitespace-nowrap " +
                              getBadgeColor(entry.moodScore)
                            }
                          >
                            {entry.moodScore}% — {getMoodLabel(entry.moodScore)}
                          </span>
                          <button
                            onClick={() => setExpandedId(entry._id)}
                            className="text-[12px] font-medium text-[#2563EB] border border-[#DBEAFE] bg-white px-3 py-1.5 hover:bg-blue-50 transition whitespace-nowrap"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {expandedId && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setExpandedId(null)}
          >
            <div
              className="bg-white border border-[#E2E8F0] p-6 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const entry = sortedHistory.find((e) => e._id === expandedId);
                if (!entry) return null;

                const mainAnswers = entry.answers.filter(
                  (ans) => typeof ans.score === "number" && ans.questionText
                );

                return (
                  <>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-[15px] font-semibold text-[#111827]">
                          {weekLabelToDateRange(entry.weekLabel)}
                        </p>
                        <p className="text-[13px] text-[#6B7280] mt-0.5">
                          Mood this week
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            "text-[13px] font-semibold px-3 py-1 whitespace-nowrap " +
                            getBadgeColor(entry.moodScore)
                          }
                        >
                          {entry.moodScore}% — {getMoodLabel(entry.moodScore)}
                        </span>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F1F5F9] text-[#6B7280] transition"
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {mainAnswers.map((ans, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3"
                        >
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE] px-2 py-0.5 w-fit tracking-widest uppercase">
                              {ans.category}
                            </span>
                            <p className="text-[13px] text-[#374151] leading-relaxed">
                              {ans.questionText}
                            </p>
                          </div>
                          <span className="text-[13px] font-bold text-[#2563EB] tabular-nums shrink-0">
                            {ans.score}/5
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <div className="mt-5">
          <MoodGraph history={history} />
        </div>

        <div className="h-10" />
      </main>
    </div>
  );
};

const MoodQuiz = () => {
  return (
    <MoodQuizProvider>
      <DailyCheckInProvider>
        <MoodAnalysisProvider>
          <MoodPredictionProvider>
            <QuizSectionProvider>
              <MoodQuizInner />
            </QuizSectionProvider>
          </MoodPredictionProvider>
        </MoodAnalysisProvider>
      </DailyCheckInProvider>
    </MoodQuizProvider>
  );
};

export default MoodQuiz;