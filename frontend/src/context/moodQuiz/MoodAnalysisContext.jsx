import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const MoodAnalysisContext = createContext(null);

export const MoodAnalysisProvider = ({ children }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-analysis", {
          headers: { Authorization: "Bearer " + token },
        });
        setAnalysis(res.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchAnalysis();
  }, []);

  return (
    <MoodAnalysisContext.Provider
      value={{
        analysis,
        loading,
        error,
      }}
    >
      {children}
    </MoodAnalysisContext.Provider>
  );
};

export const useMoodAnalysisContext = () => {
  const ctx = useContext(MoodAnalysisContext);
  if (!ctx)
    throw new Error(
      "useMoodAnalysisContext must be used inside MoodAnalysisProvider"
    );
  return ctx;
};