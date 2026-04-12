import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const MoodTrendContext = createContext(null);

function getDateFromWeekLabel(weekLabel) {
  if (!weekLabel) return weekLabel;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  for (let i = 0; i < monthNames.length; i++) {
    if (weekLabel.includes(monthNames[i])) {
      const day = weekLabel.split(" ")[0];
      return shortNames[i] + " " + day;
    }
  }
  return weekLabel;
}

function getDateObject(weekLabel) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  for (let i = 0; i < monthNames.length; i++) {
    if (weekLabel.includes(monthNames[i])) {
      const dayStr = weekLabel.split(" ")[0];
      const day = parseInt(dayStr);
      const yearStr = weekLabel.split(" ")[2];
      const year = parseInt(yearStr);
      return new Date(year, i, day);
    }
  }
  return new Date(0);
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

        const sorted = unique.slice().sort((a, b) => {
          return getDateObject(a.weekLabel) - getDateObject(b.weekLabel);
        });

        setTrendData(sorted);
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