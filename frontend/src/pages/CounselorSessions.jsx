import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import { Calendar, CheckCircle, Users } from "lucide-react";
import SessionCalendar from "../components/counselorSessions/sessionCalendar";
import DayPanel from "../components/counselorSessions/DayPanel";
import DetailModal from "../components/counselorSessions/DetailModal";
import SummaryModal from "../components/counselorSessions/SummaryModal";
import SessionCard from "../components/counselorSessions/SessionCard";

const CounselorSessions = () => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedSession, setSelectedSession] = useState(null);
  const [summarySession, setSummarySession] = useState(null);
  const [dayData, setDayData] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const ur = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sr = await axios.get("/appointments/my-sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(ur.data);
        setSessions(sr.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleStart = async (appointmentId, startLink) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/sessions/start",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      window.open(startLink, "_blank");
    } catch (e) {
      alert("Could not start session.");
    }
  };

  const handleEnd = async (appointmentId) => {
    if (!window.confirm("End this session? It will be marked as Completed."))
      return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/sessions/end",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const sr = await axios.get("/appointments/my-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sr.data);

      let ended = null;
      for (let i = 0; i < sr.data.length; i++) {
        if (sr.data[i]._id === appointmentId) {
          ended = sr.data[i];
          break;
        }
      }
      if (ended) {
        setTimeout(() => setSummarySession(ended), 300);
      }
    } catch (e) {
      alert("Could not end session.");
    }
  };

  let upcomingCount = 0;
  let completedCount = 0;
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].status === "Approved") upcomingCount++;
    if (sessions[i].status === "Completed") completedCount++;
  }

  const filtered = [];
  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i];
    if (activeTab === "Upcoming" && s.status === "Approved") {
      filtered.push(s);
    } else if (activeTab === "Completed" && s.status === "Completed") {
      filtered.push(s);
    } else if (activeTab === "Summary" && s.status === "Completed") {
      filtered.push(s);
    } else if (activeTab === "See All") {
      filtered.push(s);
    }
  }

  let emptyMessage = "No sessions yet.";
  if (activeTab === "Upcoming") {
    emptyMessage = "Students will book sessions with you from the directory.";
  } else if (activeTab === "Summary") {
    emptyMessage = "Summaries will appear here after sessions are completed.";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <CounselorSidebar user={user} />
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
    <div className="min-h-screen bg-gray-50 flex">
      <CounselorSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 pb-6 border-b-2 border-slate-300 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">My Sessions</h2>
            <p className="text-gray-500 mt-0.5">
              Check your upcoming and completed counseling sessions.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-800">
                {upcomingCount}
              </p>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Upcoming
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-800">
                {completedCount}
              </p>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-800">
                {sessions.length}
              </p>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Total Sessions
              </p>
            </div>
          </div>
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
              <button
                onClick={() => setActiveTab("Upcoming")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "Upcoming" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                Upcoming
                {upcomingCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === "Upcoming" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {upcomingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("Completed")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "Completed" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                Completed
                {completedCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === "Completed" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {completedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("Summary")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "Summary" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                Summary
                {completedCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === "Summary" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {completedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("See All")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "See All" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                See All
                {sessions.length > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === "See All" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {sessions.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <SessionCard
                  key={s._id}
                  session={s}
                  onOpen={setSelectedSession}
                  onWriteSummary={setSummarySession}
                  showSummaryButton={
                    activeTab === "Summary" || activeTab === "Completed"
                  }
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
                <p className="text-sm text-gray-400 max-w-xs">{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedSession && (
        <DetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onStart={handleStart}
          onEnd={handleEnd}
        />
      )}

      {summarySession && (
        <SummaryModal
          session={summarySession}
          onClose={() => setSummarySession(null)}
          onSaved={(id, text) => {}}
        />
      )}
    </div>
  );
};

export default CounselorSessions;
