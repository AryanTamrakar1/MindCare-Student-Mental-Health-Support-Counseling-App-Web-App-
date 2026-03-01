import React, { useState, useEffect } from "react";
import { Shield, ShieldOff, AlertCircle, RefreshCw, Info } from "lucide-react";
import API from "../../api/axios";

const RestDayIndicator = ({
  restDaysRemaining = 2,
  onRestDayUsed = () => {},
  usedRestDayToday = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [justUsed, setJustUsed] = useState(false);
  const [localRemaining, setLocalRemaining] = useState(restDaysRemaining);

  useEffect(
    function () {
      setLocalRemaining(restDaysRemaining);
    },
    [restDaysRemaining],
  );

  const alreadyUsedToday = usedRestDayToday || justUsed;
  const isDisabled = loading || localRemaining === 0 || alreadyUsedToday;

  async function handleUseRestDay() {
    if (isDisabled) return;
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        "/gamification/rest-day",
        {},
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      setJustUsed(true);
      setLocalRemaining(res.data.restDaysRemaining);
      onRestDayUsed(res.data.restDaysRemaining);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
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
    <div className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col h-full">
      <p className="text-xs font-black text-gray-800 uppercase tracking-widest mb-5">
        Rest Days
      </p>

      <div className="rounded-xl border border-gray-100 overflow-hidden mb-4">
        <div className="flex items-stretch">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-indigo-50">
            <div className="flex gap-1">
              {[0, 1].map((i) =>
                i < localRemaining ? (
                  <Shield
                    key={i}
                    className="w-4 h-4 text-indigo-500"
                    strokeWidth={2.5}
                  />
                ) : (
                  <ShieldOff
                    key={i}
                    className="w-4 h-4 text-indigo-200"
                    strokeWidth={2}
                  />
                ),
              )}
            </div>
            <p className="text-sm font-black text-indigo-900 whitespace-nowrap">
              {localRemaining} of 2{" "}
              <span className="text-indigo-400 font-semibold">Remaining</span>
            </p>
          </div>
          <div className="w-px bg-indigo-100" />
          <div className="flex items-center gap-1.5 px-3 py-3 bg-emerald-50">
            <RefreshCw className="w-3 h-3 text-emerald-400 shrink-0" />
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider whitespace-nowrap">
              Resets monthly
            </p>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white">
          <Info className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <p className="text-xs text-gray-400 font-medium">
            Use a rest day to protect your streak when you miss a day of
            activity.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-1.5 mb-4">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={handleUseRestDay}
          disabled={isDisabled}
          className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {getButtonLabel()}
        </button>
      </div>
    </div>
  );
};

export default RestDayIndicator;
