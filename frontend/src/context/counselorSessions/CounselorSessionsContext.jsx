import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";

const CounselorSessionsContext = createContext(null);

export const CounselorSessionsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
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
    if (!window.confirm("End this session? It will be marked as Completed.")) return;
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
  let missedCount = 0;
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].status === "Approved") upcomingCount = upcomingCount + 1;
    if (sessions[i].status === "Completed") completedCount = completedCount + 1;
    if (sessions[i].status === "Missed") missedCount = missedCount + 1;
  }

  const getFiltered = () => {
    const result = [];
    for (let i = 0; i < sessions.length; i++) {
      if (activeTab === "Upcoming" && sessions[i].status === "Approved") {
        result.push(sessions[i]);
      } else if (activeTab === "Completed" && sessions[i].status === "Completed") {
        result.push(sessions[i]);
      } else if (activeTab === "Missed" && sessions[i].status === "Missed") {
        result.push(sessions[i]);
      } else if (activeTab === "Summary" && sessions[i].status === "Completed") {
        result.push(sessions[i]);
      } else if (activeTab === "See All") {
        result.push(sessions[i]);
      }
    }
    return result;
  };

  const filtered = getFiltered();

  let emptyMessage = "No sessions yet.";
  if (activeTab === "Upcoming") emptyMessage = "Students will book sessions with you from the directory.";
  if (activeTab === "Missed") emptyMessage = "No missed sessions. Great work!";
  if (activeTab === "Summary") emptyMessage = "Summaries will appear here after sessions are completed.";

  const tabs = [
    { label: "Upcoming", count: upcomingCount },
    { label: "Completed", count: completedCount },
    { label: "Missed", count: missedCount },
    { label: "Summary", count: completedCount },
    { label: "See All", count: sessions.length },
  ];

  return (
    <CounselorSessionsContext.Provider
      value={{
        user,
        sessions,
        activeTab,
        setActiveTab,
        selectedSession,
        setSelectedSession,
        summarySession,
        setSummarySession,
        dayData,
        setDayData,
        handleStart,
        handleEnd,
        upcomingCount,
        completedCount,
        missedCount,
        filtered,
        emptyMessage,
        tabs,
      }}
    >
      {children}
    </CounselorSessionsContext.Provider>
  );
};

export const useCounselorSessionsContext = () => {
  const ctx = useContext(CounselorSessionsContext);
  if (!ctx)
    throw new Error(
      "useCounselorSessionsContext must be used inside CounselorSessionsProvider"
    );
  return ctx;
};