import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const MoodQuizContext = createContext(null);

export const MoodQuizProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = year + "-" + month + "-" + day;

  const [calendarDate, setCalendarDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const fetchHistory = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: "Bearer " + token };

      const quizRes = await API.get("/quiz/history", { headers });
      setHistory(quizRes.data);

      const checkInRes = await API.get("/quiz/checkin/history", { headers });
      setCheckIns(checkInRes.data);
    } catch (error) {
      console.error("Error fetching history", error);
    }
  };

  useEffect(function () {
    fetchHistory();
  }, [refreshKey]);

  const handleQuizComplete = () => {
    setRefreshKey(refreshKey + 1);
  };

  const prevMonth = () => {
    if (calendarDate.month === 0) {
      setCalendarDate({ year: calendarDate.year - 1, month: 11 });
    } else {
      setCalendarDate({ year: calendarDate.year, month: calendarDate.month - 1 });
    }
  };

  const nextMonth = () => {
    if (calendarDate.month === 11) {
      setCalendarDate({ year: calendarDate.year + 1, month: 0 });
    } else {
      setCalendarDate({ year: calendarDate.year, month: calendarDate.month + 1 });
    }
  };

  return (
    <MoodQuizContext.Provider
      value={{
        user,
        history,
        checkIns,
        expandedId,
        setExpandedId,
        today,
        todayStr,
        calendarDate,
        setCalendarDate,
        handleQuizComplete,
        prevMonth,
        nextMonth,
      }}
    >
      {children}
    </MoodQuizContext.Provider>
  );
};

export const useMoodQuizContext = () => {
  const ctx = useContext(MoodQuizContext);
  if (!ctx)
    throw new Error("useMoodQuizContext must be used inside MoodQuizProvider");
  return ctx;
};