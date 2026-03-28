import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const StudentDashboardContext = createContext(null);

export const StudentDashboardProvider = ({ children }) => {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(function () {
    async function fetchGamification() {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/gamification/me", {
          headers: { Authorization: "Bearer " + token },
        });
        setGamification(res.data);
      } catch (err) {}
    }
    fetchGamification();
  }, []);

  function getProgressPercent() {
    if (!gamification) return 0;
    if (gamification.level >= 5) return 100;
    const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];
    const currentLevelStart = LEVEL_THRESHOLDS[gamification.level - 1];
    const pointsSinceLevel = gamification.points - currentLevelStart;
    const pointsNeeded = gamification.nextLevelPoints - currentLevelStart;
    const percent = Math.round((pointsSinceLevel / pointsNeeded) * 100);
    if (percent < 0) return 0;
    if (percent > 100) return 100;
    return percent;
  }

  function getLevelColor() {
    if (!gamification) return "from-blue-600 to-blue-800";
    if (gamification.level === 1) return "from-blue-400 to-blue-600";
    if (gamification.level === 2) return "from-blue-500 to-blue-700";
    if (gamification.level === 3) return "from-blue-600 to-blue-800";
    if (gamification.level === 4) return "from-blue-700 to-blue-900";
    if (gamification.level === 5) return "from-blue-800 to-blue-950";
    return "from-blue-600 to-blue-800";
  }

  function getProgressLabel() {
    if (gamification && gamification.level < 5) {
      return "Progress to Level " + (gamification.level + 1);
    }
    return "Maximum Level Reached";
  }

  function getPointsDisplay() {
    if (gamification) return gamification.points;
    return "—";
  }

  function getLevelDisplay() {
    if (gamification) {
      return "Level " + gamification.level + ": " + gamification.levelTitle;
    }
    return "Loading...";
  }

  function getBadges() {
    if (gamification && gamification.badges.length > 0) {
      const result = [];
      for (let i = 0; i < gamification.badges.length && i < 3; i++) {
        result.push(gamification.badges[i]);
      }
      return result;
    }
    return [];
  }

  return (
    <StudentDashboardContext.Provider
      value={{
        gamification,
        getProgressPercent,
        getLevelColor,
        getProgressLabel,
        getPointsDisplay,
        getLevelDisplay,
        getBadges,
      }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
};

export const useStudentDashboardContext = () => {
  const ctx = useContext(StudentDashboardContext);
  if (!ctx)
    throw new Error(
      "useStudentDashboardContext must be used inside StudentDashboardProvider"
    );
  return ctx;
};