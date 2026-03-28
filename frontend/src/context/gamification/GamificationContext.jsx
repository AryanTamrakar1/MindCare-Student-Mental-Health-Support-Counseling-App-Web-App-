import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const GamificationContext = createContext(null);

export const GamificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(function () {
    fetchGamificationData();
  }, []);

  async function fetchGamificationData() {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/gamification/me", {
        headers: { Authorization: "Bearer " + token },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load gamification data:", err);
    }
  }

  function handleRestDayUsed(newRemaining) {
    setData({
      ...data,
      restDaysRemaining: newRemaining,
      restDaysUsed: data.restDaysUsed + 1,
      usedRestDayToday: true,
    });
  }

  return (
    <GamificationContext.Provider
      value={{
        user,
        data,
        navigate,
        handleRestDayUsed,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx)
    throw new Error(
      "useGamificationContext must be used inside GamificationProvider"
    );
  return ctx;
};