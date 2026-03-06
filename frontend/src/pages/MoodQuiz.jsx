import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import DailyCheckIn from "../components/moodQuiz/DailyCheckIn";
import QuizSection from "../components/moodQuiz/QuizSection";
import MoodGraph from "../components/moodQuiz/MoodGraph";
import MoodAnalysisCard from "../components/moodQuiz/MoodAnalysisCard";
import MoodPredictionCard from "../components/moodQuiz/MoodPredictionCard";
import API from "../api/axios";

function weekLabelToDateRange(weekLabel) {
  const parts = weekLabel.split("-W");
  const year = parseInt(parts[0]);
  const week = parseInt(parts[1]);
  const jan4 = new Date(year, 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - jan4.getDay() + 1);
  const start = new Date(startOfWeek1);
  start.setDate(start.getDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function toLocalDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

const SectionLabel = ({ text }) => (
  <div className="flex items-center gap-3 mb-4 mt-8">
    <div className="w-1.5 h-5 rounded-full bg-indigo-500" />
    <p className="text-sm font-black text-gray-700 uppercase tracking-widest">
      {text}
    </p>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MoodQuiz = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeResult, setActiveResult] = useState(null);

  const today = new Date();
  const todayStr = toLocalDateString(today);

  const [calendarDate, setCalendarDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const fetchHistory = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [quizRes, checkInRes] = await Promise.all([
        API.get("/quiz/history", { headers }),
        API.get("/quiz/checkin/history", { headers }),
      ]);
      setHistory(quizRes.data);
      setCheckIns(checkInRes.data);
    } catch (error) {
      console.error("Error fetching history", error);
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshKey]);

  const handleQuizComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const prevMonth = () => {
    setCalendarDate(({ year, month }) => {
      if (month === 0) return { year: year - 1, month: 11 };
      return { year, month: month - 1 };
    });
  };

  const nextMonth = () => {
    setCalendarDate(({ year, month }) => {
      if (month === 11) return { year: year + 1, month: 0 };
      return { year, month: month + 1 };
    });
  };

  function getBadgeColor(score) {
    if (score >= 80)
      return "bg-green-50 text-green-600 border border-green-200";
    if (score >= 60) return "bg-blue-50 text-blue-600 border border-blue-200";
    if (score >= 40)
      return "bg-yellow-50 text-yellow-600 border border-yellow-200";
    return "bg-red-50 text-red-500 border border-red-200";
  }

  const moodMap = {
    1: {
      emoji: "😔",
      label: "Very Bad",
      bg: "bg-red-50",
      text: "text-red-500",
      border: "border-red-100",
    },
    2: {
      emoji: "😟",
      label: "Bad",
      bg: "bg-orange-50",
      text: "text-orange-500",
      border: "border-orange-100",
    },
    3: {
      emoji: "😐",
      label: "Okay",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-100",
    },
    4: {
      emoji: "🙂",
      label: "Good",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    5: {
      emoji: "😊",
      label: "Great",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
  };

  const reversedHistory = [];
  for (let i = history.length - 1; i >= 0; i--) {
    reversedHistory.push(history[i]);
  }

  const checkInMap = {};
  for (let i = 0; i < checkIns.length; i++) {
    checkInMap[checkIns[i].date] = checkIns[i];
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
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  if (loadingHistory || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Mood Quiz...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar user={user} />

      <main className="flex-1 ml-[280px] px-10 py-8 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Weekly Mood Quiz
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track your mental well-being every week.
            </p>
          </div>
          <Navbar />
        </div>

        <MoodAnalysisCard />

        <SectionLabel text="Mood Prediction" />
        <MoodPredictionCard />

        <SectionLabel text="Daily Check-In" />
        <DailyCheckIn />

        <SectionLabel text="Weekly Quiz" />
        <QuizSection onQuizComplete={handleQuizComplete} />

        <div className="mt-8">
          <div className="grid grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col">
              <SectionLabel text="Past Quiz Results" />
              <div
                className="bg-white rounded-2xl p-4 border border-black/10 flex flex-col overflow-hidden"
                style={{ height: "420px" }}
              >
                {reversedHistory.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No quiz results yet.
                  </p>
                )}
                {reversedHistory.length > 0 && (
                  <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0">
                    {reversedHistory.map((entry) => (
                      <div
                        key={entry._id}
                        className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between gap-3 shrink-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 truncate">
                            {weekLabelToDateRange(entry.weekLabel)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {entry.moodLabel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={
                              "text-xs font-semibold px-2.5 py-1 rounded-full " +
                              getBadgeColor(entry.moodScore)
                            }
                          >
                            {entry.moodScore}%
                          </span>
                          <button
                            onClick={() => setActiveResult(entry._id)}
                            className="text-xs text-blue-600 border border-blue-100 bg-white rounded-lg px-3 py-1.5 hover:bg-blue-50 transition whitespace-nowrap"
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <SectionLabel text="Recent Daily Check-Ins" />
              <div
                className="bg-white rounded-2xl p-4 border border-black/10 flex flex-col"
                style={{ height: "420px" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={prevMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ChevronLeft />
                  </button>
                  <p className="text-sm font-semibold text-gray-700">
                    {calMonthLabel}
                  </p>
                  <button
                    onClick={nextMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ChevronRight />
                  </button>
                </div>

                <div
                  className="grid grid-cols-7 flex-1"
                  style={{
                    gridTemplateRows: `repeat(${Math.ceil(calendarCells.length / 7) + 1}, 1fr)`,
                  }}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="flex items-center justify-center text-xs font-semibold text-gray-400"
                      >
                        {d}
                      </div>
                    ),
                  )}
                  {calendarCells.map((day, idx) => {
                    if (day === null) {
                      return <div key={"empty-" + idx} />;
                    }

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

                    let cellClass =
                      "flex flex-col items-center justify-center rounded-lg gap-0.5 m-0.5";
                    if (mood) {
                      cellClass =
                        cellClass +
                        " " +
                        mood.bg +
                        " " +
                        mood.border +
                        " border";
                    } else if (isToday) {
                      cellClass =
                        cellClass + " bg-blue-50 border border-blue-100";
                    }
                    if (isFuture) {
                      cellClass = cellClass + " opacity-30";
                    }

                    let dayTextClass = "text-xs font-bold leading-none ";
                    if (mood) {
                      dayTextClass = dayTextClass + mood.text;
                    } else if (isToday) {
                      dayTextClass = dayTextClass + "text-blue-600";
                    } else {
                      dayTextClass = dayTextClass + "text-gray-500";
                    }

                    return (
                      <div key={key} className={cellClass}>
                        <span className={dayTextClass}>{day}</span>
                        {mood && (
                          <span className="text-sm leading-none">
                            {mood.emoji}
                          </span>
                        )}
                        {!mood && isToday && (
                          <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeResult && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={() => setActiveResult(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const entry = reversedHistory.find(
                  (e) => e._id === activeResult,
                );
                if (!entry) return null;
                return (
                  <>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {weekLabelToDateRange(entry.weekLabel)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {entry.moodLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            "text-sm font-semibold px-3 py-1 rounded-full " +
                            getBadgeColor(entry.moodScore)
                          }
                        >
                          {entry.moodScore}%
                        </span>
                        <button
                          onClick={() => setActiveResult(null)}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {entry.answers.map((ans, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start gap-4 bg-gray-50 rounded-xl px-4 py-3"
                        >
                          <p className="text-xs text-gray-600 flex-1">
                            {ans.questionText}
                          </p>
                          <span className="text-xs font-semibold text-blue-600 shrink-0">
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

        <SectionLabel text="Mood History" />
        <MoodGraph history={history} />

        <div className="h-10" />
      </main>
    </div>
  );
};

export default MoodQuiz;
