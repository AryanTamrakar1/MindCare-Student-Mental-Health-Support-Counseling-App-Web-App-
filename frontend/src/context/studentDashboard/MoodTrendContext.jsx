import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const MoodTrendContext = createContext(null);

function getDateFromWeekLabel(weekLabel) {
  if (!weekLabel) return weekLabel;
  try {
    const parts = weekLabel.split("-W");
    const year = parseInt(parts[0]);
    const week = parseInt(parts[1]);
    const jan4 = new Date(year, 0, 4);
    const day = jan4.getDay();
    const diff = jan4.getDate() - day + (day === 0 ? -6 : 1); 
    const mondayWeek1 = new Date(year, 0, diff);
    const monday = new Date(mondayWeek1);
    monday.setDate(mondayWeek1.getDate() + (week - 1) * 7);
    return monday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (error) {
    return weekLabel;
  }
}

export const MoodTrendProvider = ({ children }) => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    const fetchHistory = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/quiz/history", {
          headers: { Authorization: "Bearer " + token },
        });
        const quizzes = res.data;
        let startIndex = 0;
        if (quizzes.length > 7) {
          startIndex = quizzes.length - 7;
        }
        const data = [];
        for (let i = startIndex; i < quizzes.length; i++) {
          let weekLabel = quizzes[i].weekLabel;
          let label = getDateFromWeekLabel(weekLabel);
          data.push({ score: quizzes[i].moodScore, label: label, weekLabel: weekLabel });  
        }

        const unique = data.filter(
          (item, i, arr) => i === 0 || item.weekLabel !== arr[i - 1].weekLabel
        );

        setTrendData(unique);
      } catch (err) {}
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <MoodTrendContext.Provider value={{ trendData, loading }}>
      {children}
    </MoodTrendContext.Provider>
  );
};

export const useMoodTrendContext = () => {
  const ctx = useContext(MoodTrendContext);
  if (!ctx)
    throw new Error("useMoodTrendContext must be used inside MoodTrendProvider");
  return ctx;
};