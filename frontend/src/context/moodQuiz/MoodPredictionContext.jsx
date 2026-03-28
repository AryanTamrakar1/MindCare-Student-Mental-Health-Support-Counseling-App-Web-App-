import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const MoodPredictionContext = createContext(null);

export const MoodPredictionProvider = ({ children }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/mood-prediction", {
          headers: { Authorization: "Bearer " + token },
        });
        setPrediction(res.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchPrediction();
  }, []);

  return (
    <MoodPredictionContext.Provider
      value={{
        prediction,
        loading,
        error,
      }}
    >
      {children}
    </MoodPredictionContext.Provider>
  );
};

export const useMoodPredictionContext = () => {
  const ctx = useContext(MoodPredictionContext);
  if (!ctx)
    throw new Error(
      "useMoodPredictionContext must be used inside MoodPredictionProvider"
    );
  return ctx;
};