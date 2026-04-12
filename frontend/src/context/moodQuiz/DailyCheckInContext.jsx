import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";
import { useMoodQuizContext } from "../../context/moodQuiz/MoodQuizContext";

const DailyCheckInContext = createContext(null);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getTodayString() {
  const d = new Date();
  return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
}

export const DailyCheckInProvider = ({ children }) => {
  const { fetchCheckIns } = useMoodQuizContext();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    const checkToday = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const today = getTodayString();
        const res = await API.get("/quiz/checkin/today", {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: today },
        });
        if (res.data.checkedIn) {
          setAlreadyDone(true);
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error checking today's check-in", error);
      }
    };
    checkToday();
  }, []);

  const handleSubmit = async () => {
    if (selected === null) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const today = getTodayString();
      await API.post(
        "/quiz/checkin",
        { mood: selected, date: today },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
      setAlreadyDone(true);
      await fetchCheckIns();
    } catch (error) {
      console.error("Check-in error", error);
    }
    setLoading(false);
  };

  return (
    <DailyCheckInContext.Provider
      value={{
        selected,
        setSelected,
        submitted,
        loading,
        alreadyDone,
        handleSubmit,
      }}
    >
      {children}
    </DailyCheckInContext.Provider>
  );
};

export const useDailyCheckInContext = () => {
  const ctx = useContext(DailyCheckInContext);
  if (!ctx)
    throw new Error(
      "useDailyCheckInContext must be used inside DailyCheckInProvider"
    );
  return ctx;
};