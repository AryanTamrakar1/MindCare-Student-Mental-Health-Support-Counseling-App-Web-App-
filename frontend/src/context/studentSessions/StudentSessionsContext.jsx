import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";
import { Calendar, CheckCircle, XCircle, FileText, AlertCircle, Clock } from "lucide-react";

const StudentSessionsContext = createContext(null);

export const StudentSessionsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedSession, setSelectedSession] = useState(null);
  const [summarySession, setSummarySession] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [ratingSession, setRatingSession] = useState(null);

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const userRes = await axios.get("/auth/me", {
        headers: { Authorization: "Bearer " + token },
      });
      setUser(userRes.data);
      const sessionRes = await axios.get("/appointments/my-sessions", {
        headers: { Authorization: "Bearer " + token },
      });
      setSessions(sessionRes.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleJoin(appointmentId, zoomLink) {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/sessions/join",
        { appointmentId },
        { headers: { Authorization: "Bearer " + token } }
      );
      window.open(zoomLink, "_blank");
    } catch {
      alert("Could not join session.");
    }
  }

  const upcomingCount = sessions.filter((s) => s.status === "Approved").length;
  const pendingCount = sessions.filter((s) => s.status === "Pending").length;
  const completedCount = sessions.filter((s) => s.status === "Completed").length;
  const declinedCount = sessions.filter((s) => s.status === "Declined").length;
  const missedCount = sessions.filter((s) => s.status === "Missed").length;

  const getFilteredSessions = () => {
    if (activeTab === "Upcoming") return sessions.filter((s) => s.status === "Approved");
    if (activeTab === "Pending") return sessions.filter((s) => s.status === "Pending");
    if (activeTab === "Completed") return sessions.filter((s) => s.status === "Completed");
    if (activeTab === "Declined") return sessions.filter((s) => s.status === "Declined");
    if (activeTab === "Missed") return sessions.filter((s) => s.status === "Missed");
    if (activeTab === "Summary") return sessions.filter((s) => s.status === "Completed");
    return sessions;
  };

  const filtered = getFilteredSessions();

  const statCards = [
    {
      count: upcomingCount,
      label: "Upcoming",
      icon: <Calendar size={20} className="text-emerald-600" strokeWidth={2} />,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      count: pendingCount,
      label: "Pending",
      icon: <AlertCircle size={20} className="text-yellow-600" strokeWidth={2} />,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      count: completedCount,
      label: "Completed",
      icon: <CheckCircle size={20} className="text-[#2563EB]" strokeWidth={2} />,
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      count: declinedCount,
      label: "Declined",
      icon: <XCircle size={20} className="text-red-500" strokeWidth={2} />,
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      count: missedCount,
      label: "Missed",
      icon: <Clock size={20} className="text-orange-500" strokeWidth={2} />,
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    {
      count: completedCount,
      label: "Summary",
      icon: <FileText size={20} className="text-purple-600" strokeWidth={2} />,
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
  ];

  const tabs = [
    { label: "Upcoming", count: upcomingCount },
    { label: "Pending", count: pendingCount },
    { label: "Completed", count: completedCount },
    { label: "Declined", count: declinedCount },
    { label: "Missed", count: missedCount },
    { label: "Summary", count: completedCount },
    { label: "See All", count: sessions.length },
  ];

  return (
    <StudentSessionsContext.Provider
      value={{
        user,
        sessions,
        activeTab,
        setActiveTab,
        selectedSession,
        setSelectedSession,
        summarySession,
        setSummarySession,
        ratingSession,
        setRatingSession,
        dayData,
        setDayData,
        handleJoin,
        filtered,
        statCards,
        tabs,
      }}
    >
      {children}
    </StudentSessionsContext.Provider>
  );
};

export const useStudentSessionsContext = () => {
  const ctx = useContext(StudentSessionsContext);
  if (!ctx) throw new Error("useStudentSessionsContext must be used inside StudentSessionsProvider");
  return ctx;
};