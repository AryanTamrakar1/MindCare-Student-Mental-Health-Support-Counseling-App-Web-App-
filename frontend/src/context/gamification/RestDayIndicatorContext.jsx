import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const RestDayIndicatorContext = createContext(null);

export const RestDayIndicatorProvider = ({ children, restDaysRemaining, usedRestDayToday, onRestDayUsed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [justUsed, setJustUsed] = useState(false);
  const [localRemaining, setLocalRemaining] = useState(restDaysRemaining);

  useEffect(function () {
    setLocalRemaining(restDaysRemaining);
  }, [restDaysRemaining]);

  const alreadyUsedToday = usedRestDayToday || justUsed;
  const isDisabled = loading || localRemaining === 0 || alreadyUsedToday;

  async function handleUseRestDay() {
    if (isDisabled) return;
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put("/gamification/rest-day", {}, {
        headers: { Authorization: "Bearer " + token },
      });
      setJustUsed(true);
      setLocalRemaining(res.data.restDaysRemaining);
      onRestDayUsed(res.data.restDaysRemaining);
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err && err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message);
    }
    setLoading(false);
  }

  function getButtonLabel() {
    if (loading) return "Using...";
    if (localRemaining === 0) return "No Rest Days Left";
    if (alreadyUsedToday) return "Rest Day Used Today ✓";
    return "Use a Rest Day";
  }

  return (
    <RestDayIndicatorContext.Provider
      value={{
        loading,
        error,
        localRemaining,
        alreadyUsedToday,
        isDisabled,
        handleUseRestDay,
        getButtonLabel,
      }}
    >
      {children}
    </RestDayIndicatorContext.Provider>
  );
};

export const useRestDayIndicatorContext = () => {
  const ctx = useContext(RestDayIndicatorContext);
  if (!ctx)
    throw new Error(
      "useRestDayIndicatorContext must be used inside RestDayIndicatorProvider"
    );
  return ctx;
};