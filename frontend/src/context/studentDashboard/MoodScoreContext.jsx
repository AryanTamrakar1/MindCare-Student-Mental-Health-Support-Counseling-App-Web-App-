import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const MoodScoreContext = createContext(null);

export const MoodScoreProvider = ({ children }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    const fetchAnalysis = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-analysis", {
          headers: { Authorization: "Bearer " + token },
        });
        setAnalysis(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  return (
    <MoodScoreContext.Provider value={{ analysis, loading }}>
      {children}
    </MoodScoreContext.Provider>
  );
};

export const useMoodScoreContext = () => {
  const ctx = useContext(MoodScoreContext);
  if (!ctx)
    throw new Error("useMoodScoreContext must be used inside MoodScoreProvider");
  return ctx;
};