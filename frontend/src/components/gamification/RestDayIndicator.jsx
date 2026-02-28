import React, { useState } from "react";
import { Shield, ShieldOff, AlertCircle, Info } from "lucide-react";
import API from "../../api/axios";

const RestDayIndicator = ({
  restDaysUsed,
  restDaysRemaining,
  onRestDayUsed,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [usedThisSession, setUsedThisSession] = useState(false);

  async function handleUseRestDay() {
    if (loading || usedThisSession) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        "/gamification/rest-day",
        {},
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      setSuccessMessage(res.data.message);
      setUsedThisSession(true);
      onRestDayUsed(res.data.restDaysRemaining);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    setLoading(false);
  }

  function renderShields() {
    const shields = [];
    for (let i = 0; i < 2; i++) {
      if (i < restDaysRemaining) {
        shields.push(<Shield key={i} className="w-7 h-7 text-indigo-500" />);
      } else {
        shields.push(<ShieldOff key={i} className="w-7 h-7 text-gray-300" />);
      }
    }
    return shields;
  }

  function getButtonLabel() {
    if (loading) return "Using...";
    if (usedThisSession) return "Rest Day Used";
    if (restDaysRemaining === 0) return "No Rest Days Left";
    return "Use a Rest Day";
  }

  const isDisabled = loading || restDaysRemaining === 0 || usedThisSession;

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col gap-4 h-full">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Rest Days
      </p>

      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">{renderShields()}</div>
        <div>
          <p className="text-sm font-black text-gray-800">
            {restDaysRemaining} of 2 Remaining
          </p>
          <p className="text-xs text-gray-400 font-semibold">
            Resets every month
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-xs font-bold text-green-700">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-xs font-bold text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={handleUseRestDay}
          disabled={isDisabled}
          className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {getButtonLabel()}
        </button>

        {restDaysRemaining === 0 && (
          <p className="text-xs text-center text-gray-400 font-semibold mt-2">
            Rest days reset at the start of next month.
          </p>
        )}
      </div>
    </div>
  );
};

export default RestDayIndicator;
