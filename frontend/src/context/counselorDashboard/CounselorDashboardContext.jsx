import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const CounselorDashboardContext = createContext(null);

export const CounselorDashboardProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pendingCount, setPendingCount] = useState(0);
  const [ratingData, setRatingData] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(function () {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: "Bearer " + token };

    try {
      const pendingRes = await API.get("/appointments/pending", { headers });
      setPendingCount(pendingRes.data.length);
    } catch (err) {
      console.error("Error fetching pending:", err);
    }

    try {
      const ratingsRes = await API.get("/ratings/my-ratings", { headers });
      setRatingData(ratingsRes.data);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }

    try {
      const sessionsRes = await API.get("/appointments/my-sessions", { headers });
      setAllSessions(sessionsRes.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }

    try {
      const forumRes = await API.get("/forum", { headers });
      const allPosts = forumRes.data;
      const recent = [];
      for (let i = allPosts.length - 1; i >= 0 && recent.length < 4; i--) {
        recent.push(allPosts[i]);
      }
      setPosts(recent);
    } catch (err) {
      console.error("Error fetching forum:", err);
    }
  };

  function prevYear() {
    setSelectedYear(selectedYear - 1);
  }

  function nextYear() {
    setSelectedYear(selectedYear + 1);
  }

  return (
    <CounselorDashboardContext.Provider
      value={{
        selectedYear,
        prevYear,
        nextYear,
        pendingCount,
        ratingData,
        allSessions,
        posts,
      }}
    >
      {children}
    </CounselorDashboardContext.Provider>
  );
};

export const useCounselorDashboardContext = () => {
  const ctx = useContext(CounselorDashboardContext);
  if (!ctx)
    throw new Error(
      "useCounselorDashboardContext must be used inside CounselorDashboardProvider"
    );
  return ctx;
};