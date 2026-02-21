import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import {
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import SessionCalendar from "../components/studentSessions/SessionCalendar";
import DayPanel from "../components/studentSessions/DayPanel";
import DetailModal from "../components/studentSessions/DetailModal";
import SummaryModal from "../components/studentSessions/SummaryModal";
import SessionCard from "../components/studentSessions/SessionCard";
import SummaryCard from "../components/studentSessions/SummaryCard";
import RatingModal from "../components/studentSessions/RatingModal";

const StudentSessions = () => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedSession, setSelectedSession] = useState(null);
  const [summarySession, setSummarySession] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [ratingSession, setRatingSession] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const userRes = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const sessionRes = await axios.get("/appointments/my-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessionRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (appointmentId, zoomLink) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/sessions/join",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      window.open(zoomLink, "_blank");
    } catch {
      alert("Could not join session.");
    }
  };

  const upcomingCount = sessions.filter((s) => s.status === "Approved").length;
  const completedCount = sessions.filter(
    (s) => s.status === "Completed",
  ).length;
  const declinedCount = sessions.filter((s) => s.status === "Declined").length;
  const pendingCount = sessions.filter((s) => s.status === "Pending").length;

  const getFilteredSessions = () => {
    if (activeTab === "Upcoming")
      return sessions.filter((s) => s.status === "Approved");
    if (activeTab === "Completed")
      return sessions.filter((s) => s.status === "Completed");
    if (activeTab === "Declined")
      return sessions.filter((s) => s.status === "Declined");
    if (activeTab === "Pending")
      return sessions.filter((s) => s.status === "Pending");
    if (activeTab === "Summary")
      return sessions.filter((s) => s.status === "Completed");
    return sessions;
  };

  const filtered = getFilteredSessions();

  const statCards = [
    {
      count: upcomingCount,
      label: "Upcoming",
      icon: <Calendar size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      count: pendingCount,
      label: "Pending",
      icon: <AlertCircle size={20} className="text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    {
      count: completedCount,
      label: "Completed",
      icon: <CheckCircle size={20} className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      count: declinedCount,
      label: "Declined",
      icon: <XCircle size={20} className="text-red-500" />,
      bg: "bg-red-50",
    },
    {
      count: completedCount,
      label: "Summary",
      icon: <FileText size={20} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
  ];

  const tabs = [
    { label: "Upcoming", count: upcomingCount },
    { label: "Pending", count: pendingCount },
    { label: "Completed", count: completedCount },
    { label: "Declined", count: declinedCount },
    { label: "Summary", count: completedCount },
    { label: "See All", count: sessions.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Loading Sessions…
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <StudentSidebar user={user} />
      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 pb-6 border-b-2 border-slate-300 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">My Sessions</h2>
            <p className="text-gray-500 mt-0.5">
              Manage your upcoming and completed counseling sessions.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-5 gap-5 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800">
                  {card.count}
                </p>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <SessionCalendar
          sessions={sessions}
          onDateClick={(ds, di) =>
            setDayData(ds ? { sessions: ds, dayInfo: di } : null)
          }
        />

        {dayData && (
          <DayPanel
            daySessions={dayData.sessions}
            dayInfo={dayData.dayInfo}
            onClose={() => setDayData(null)}
            onOpen={setSelectedSession}
          />
        )}

        <div className="mt-10">
          <div className="border-t-2 border-slate-300 pt-6 pb-6 border-b-2 flex justify-between items-start mb-5">
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                All Sessions
              </h2>
              <p className="text-gray-500 mt-0.5">
                View all your upcoming and past sessions.
              </p>
            </div>
            <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1 shadow-sm">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {activeTab === "Summary" ? (
              filtered.length > 0 ? (
                filtered.map((s) => (
                  <SummaryCard
                    key={s._id}
                    session={s}
                    onOpen={setSelectedSession}
                    onViewSummary={setSummarySession}
                    onRate={setRatingSession}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
                    <FileText size={22} className="text-indigo-300" />
                  </div>
                  <p className="font-black text-gray-600 mb-1">
                    No Summaries Yet
                  </p>
                  <p className="text-sm text-gray-400 max-w-xs">
                    The Session Summary will appear after your counselor writes
                    them.
                  </p>
                </div>
              )
            ) : filtered.length > 0 ? (
              filtered.map((s) => (
                <SessionCard
                  key={s._id}
                  session={s}
                  onOpen={setSelectedSession}
                  onViewSummary={setSummarySession}
                  onRate={setRatingSession}
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
                  <Calendar size={22} className="text-indigo-300" />
                </div>
                <p className="font-black text-gray-600 mb-1">
                  No {activeTab} Sessions
                </p>
                <p className="text-sm text-gray-400 max-w-xs">
                  {activeTab === "Upcoming"
                    ? "Visit the counselor directory to book a session!"
                    : `No ${activeTab.toLowerCase()} sessions yet.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedSession && (
        <DetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onJoin={handleJoin}
          onRate={setRatingSession}
        />
      )}
      {summarySession && (
        <SummaryModal
          session={summarySession}
          onClose={() => setSummarySession(null)}
        />
      )}
      {ratingSession && (
        <RatingModal
          session={ratingSession}
          onClose={() => setRatingSession(null)}
          onRated={() => setRatingSession(null)}
        />
      )}
    </div>
  );
};

export default StudentSessions;
