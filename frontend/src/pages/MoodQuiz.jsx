import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import DailyCheckIn from "../components/moodQuiz/DailyCheckIn";
import QuizSection from "../components/moodQuiz/QuizSection";
import MoodGraph from "../components/moodQuiz/MoodGraph";
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
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

const SectionLabel = ({ text }) => (
  <div className="mb-4 mt-8">
    <p className="text-sm text-gray-500 mb-3">{text}</p>
    <div className="border-b border-gray-200" />
  </div>
);

const ScoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);

const TrendDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" />
  </svg>
);

const TrendFlatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="15 8 19 12 15 16" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const todayStr = today.toISOString().split("T")[0];
  const [calendarDate, setCalendarDate] = useState({ year: today.getFullYear(), month: today.getMonth() });

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

  const handleQuizComplete = () => setRefreshKey((prev) => prev + 1);

  const prevMonth = () => {
    setCalendarDate(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  };

  const nextMonth = () => {
    setCalendarDate(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
  };

  const isCurrentMonth =
    calendarDate.year === today.getFullYear() && calendarDate.month === today.getMonth();

  function getTrend(h) {
    if (h.length < 2) return null;
    const last = h[h.length - 1].moodScore;
    const prev = h[h.length - 2].moodScore;
    if (last > prev) return { label: "Improving", color: "text-green-600", iconColor: "text-green-600", bg: "bg-green-50", Icon: TrendUpIcon };
    if (last < prev) return { label: "Declining", color: "text-red-500", iconColor: "text-red-500", bg: "bg-red-50", Icon: TrendDownIcon };
    return { label: "Stable", color: "text-yellow-500", iconColor: "text-yellow-500", bg: "bg-yellow-50", Icon: TrendFlatIcon };
  }

  function getBadgeColor(score) {
    if (score >= 80) return "bg-green-50 text-green-600 border border-green-200";
    if (score >= 60) return "bg-blue-50 text-blue-600 border border-blue-200";
    if (score >= 40) return "bg-yellow-50 text-yellow-600 border border-yellow-200";
    return "bg-red-50 text-red-500 border border-red-200";
  }

  const moodMap = {
    1: { emoji: "😔", label: "Bad", bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
    2: { emoji: "😐", label: "Okay", bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" },
    3: { emoji: "😊", label: "Good", bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  };

  const trend = getTrend(history);
  const latestQuiz = history[history.length - 1];
  const reversedHistory = [...history].reverse();

  const checkInMap = {};
  checkIns.forEach((e) => { checkInMap[e.date] = e; });

  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const currentWeekDays = [0, 1, 2, 3, 4].map((offset) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    const key = d.toISOString().split("T")[0];
    return {
      key,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-US", { month: "short" }),
      isToday: key === todayStr,
      isFuture: d > today,
      entry: checkInMap[key] || null,
    };
  });

  const calMonthLabel = new Date(calendarDate.year, calendarDate.month, 1)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(calendarDate.year, calendarDate.month, 1).getDay();
  const daysInMonth = new Date(calendarDate.year, calendarDate.month + 1, 0).getDate();
  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar user={user} />

      <main className="flex-1 ml-[280px] px-10 py-8 overflow-y-auto">

        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Weekly Mood Quiz</h2>
            <p className="text-sm text-gray-500 mt-1">Track your mental well-being every week.</p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="bg-white rounded-2xl p-5 border border-black/10 flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <ScoreIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Latest Score</p>
              {latestQuiz ? (
                <>
                  <p className="text-2xl font-black text-gray-800 leading-none">{latestQuiz.moodScore}%</p>
                  <p className="text-xs text-gray-400 mt-1">{latestQuiz.moodLabel}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No data yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/10 flex items-center justify-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${trend ? trend.bg + " " + trend.iconColor : "bg-gray-50 text-gray-400"}`}>
              {trend ? <trend.Icon /> : <TrendFlatIcon />}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Current Trend</p>
              {trend ? (
                <p className={`text-xl font-black leading-none ${trend.color}`}>{trend.label}</p>
              ) : (
                <p className="text-sm text-gray-400">Need more data</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/10 flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <CalendarIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Quizzes</p>
              <p className="text-2xl font-black text-gray-800 leading-none">{history.length}</p>
              <p className="text-xs text-gray-400 mt-1">completed</p>
            </div>
          </div>
        </div>

        <SectionLabel text="Daily Check-In" />
        <DailyCheckIn />

        <SectionLabel text="Weekly Quiz" />
        <QuizSection onQuizComplete={handleQuizComplete} />

        <div className="mt-8">
          <div className="grid grid-cols-2 gap-6 items-stretch">

            <div className="flex flex-col">
              <p className="text-sm text-gray-500 mb-3">Past Quiz Results</p>
              <div className="border-b border-gray-200 mb-4" />
              <div className="bg-white rounded-2xl p-4 border border-black/10 flex flex-col overflow-hidden" style={{ height: "420px" }}>
                {reversedHistory.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No quiz results yet.</p>
                ) : (
                  <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0">
                    {reversedHistory.map((entry) => (
                      <div key={entry._id} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between gap-3 shrink-0">
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 truncate">{weekLabelToDateRange(entry.weekLabel)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{entry.moodLabel}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getBadgeColor(entry.moodScore)}`}>
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
              <p className="text-sm text-gray-500 mb-3">Recent Daily Check-Ins</p>
              <div className="border-b border-gray-200 mb-4" />
              <div className="bg-white rounded-2xl p-4 border border-black/10 flex flex-col" style={{ height: "420px" }}>
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={prevMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ChevronLeft />
                  </button>
                  <p className="text-sm font-semibold text-gray-700">{calMonthLabel}</p>
                  <button
                    onClick={nextMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ChevronRight />
                  </button>
                </div>

                <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${Math.ceil(calendarCells.length / 7) + 1}, 1fr)` }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="flex items-center justify-center text-xs font-semibold text-gray-400">{d}</div>
                  ))}
                  {calendarCells.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} />;
                    const d = new Date(calendarDate.year, calendarDate.month, day);
                    const key = d.toISOString().split("T")[0];
                    const isToday = key === todayStr;
                    const isFuture = d > today;
                    const entry = checkInMap[key];
                    const mood = entry ? moodMap[entry.mood] : null;
                    return (
                      <div
                        key={key}
                        className={`flex flex-col items-center justify-center rounded-lg gap-0.5 m-0.5
                          ${mood ? `${mood.bg} ${mood.border} border` : isToday ? "bg-blue-50 border border-blue-100" : ""}
                          ${isFuture ? "opacity-30" : ""}`}
                      >
                        <span className={`text-xs font-bold leading-none ${mood ? mood.text : isToday ? "text-blue-600" : "text-gray-500"}`}>
                          {day}
                        </span>
                        {mood ? (
                          <span className="text-sm leading-none">{mood.emoji}</span>
                        ) : isToday ? (
                          <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </div>

        {activeResult && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setActiveResult(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const entry = reversedHistory.find((e) => e._id === activeResult);
                if (!entry) return null;
                return (
                  <>
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{weekLabelToDateRange(entry.weekLabel)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{entry.moodLabel}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getBadgeColor(entry.moodScore)}`}>{entry.moodScore}%</span>
                        <button onClick={() => setActiveResult(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {entry.answers?.map((ans, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-xs text-gray-600 flex-1">{ans.questionText}</p>
                          <span className="text-xs font-semibold text-blue-600 shrink-0">{ans.score}/5</span>
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