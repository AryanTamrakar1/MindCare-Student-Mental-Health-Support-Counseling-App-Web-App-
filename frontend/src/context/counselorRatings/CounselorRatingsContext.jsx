import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";

const CounselorRatingsContext = createContext(null);

const QUESTIONS = [
  { key: "professionalism", label: "Professionalism" },
  { key: "clarity", label: "Clarity" },
  { key: "empathy", label: "Empathy" },
  { key: "helpfulness", label: "Helpfulness" },
  { key: "overallSatisfaction", label: "Overall Satisfaction" },
];

function getAverage(averages, key) {
  if (!averages) return 0;
  if (averages[key]) return averages[key];
  return 0;
}

export const CounselorRatingsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const ur = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rr = await axios.get("/ratings/my-ratings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(ur.data);
        setData(rr.data);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  let hasRatings = false;
  let overall = 0;
  let strongestQ = QUESTIONS[0];
  let strongestVal = 0;
  let weakestQ = QUESTIONS[0];
  let weakVal = 0;

  if (data) {
    if (data.totalRatings && data.totalRatings > 0) {
      hasRatings = true;
    }

    if (data.averages && data.averages.overall) {
      overall = data.averages.overall;
    }

    strongestQ = QUESTIONS[0];
    for (let i = 1; i < QUESTIONS.length; i++) {
      if (
        getAverage(data.averages, QUESTIONS[i].key) >
        getAverage(data.averages, strongestQ.key)
      ) {
        strongestQ = QUESTIONS[i];
      }
    }
    strongestVal = getAverage(data.averages, strongestQ.key);

    weakestQ = QUESTIONS[0];
    for (let i = 1; i < QUESTIONS.length; i++) {
      if (
        getAverage(data.averages, QUESTIONS[i].key) <
        getAverage(data.averages, weakestQ.key)
      ) {
        weakestQ = QUESTIONS[i];
      }
    }
    weakVal = getAverage(data.averages, weakestQ.key);
  }

  return (
    <CounselorRatingsContext.Provider
      value={{
        user,
        data,
        hasRatings,
        overall,
        strongestQ,
        strongestVal,
        weakestQ,
        weakVal,
      }}
    >
      {children}
    </CounselorRatingsContext.Provider>
  );
};

export const useCounselorRatingsContext = () => {
  const ctx = useContext(CounselorRatingsContext);
  if (!ctx)
    throw new Error(
      "useCounselorRatingsContext must be used inside CounselorRatingsProvider"
    );
  return ctx;
};