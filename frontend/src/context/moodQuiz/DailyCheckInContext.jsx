import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const DailyCheckInContext = createContext(null);

export const DailyCheckInProvider = ({ children }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    const checkToday = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/quiz/checkin/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const today = new Date().toISOString().split("T")[0];
        if (res.data.find((entry) => entry.date === today)) {
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
      await API.post("/quiz/checkin", { mood: selected }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmitted(true);
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