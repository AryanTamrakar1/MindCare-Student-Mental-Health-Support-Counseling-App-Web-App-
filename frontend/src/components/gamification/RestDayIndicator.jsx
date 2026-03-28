import React from "react";
import { Shield, ShieldOff, AlertCircle, RefreshCw, Info } from "lucide-react";
import { RestDayIndicatorProvider } from "../../context/gamification/RestDayIndicatorContext";
import { useRestDayIndicator } from "../../hooks/gamification/useRestDayIndicator";

const RestDayIndicatorInner = () => {
  const {
    loading,
    error,
    localRemaining,
    alreadyUsedToday,
    isDisabled,
    handleUseRestDay,
    getButtonLabel,
  } = useRestDayIndicator();

  const shieldIcons = [];
  for (let i = 0; i < 2; i++) {
    if (i < localRemaining) {
      shieldIcons.push(<Shield key={i} className="w-4 h-4 text-blue-500" strokeWidth={2.5} />);
    } else {
      shieldIcons.push(<ShieldOff key={i} className="w-4 h-4 text-blue-200" strokeWidth={2} />);
    }
  }

  return (
    <div className="bg-white border border-[#E5E7EB] flex flex-col h-full overflow-hidden">

      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <p className="text-[15px] font-black text-gray-800 uppercase tracking-widest">
          Rest Days
        </p>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="border border-gray-200 overflow-hidden mb-4">
          <div className="flex items-stretch">
            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-blue-50">
              <div className="flex gap-1">
                {shieldIcons}
              </div>
              <p className="text-sm font-black text-blue-900 whitespace-nowrap">
                {localRemaining} of 2{" "}
                <span className="text-blue-400 font-semibold">Remaining</span>
              </p>
            </div>
            <div className="w-px bg-blue-100" />
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
              Use a rest day to protect your streak when you miss a day of activity.
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
            className="w-full py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};

const RestDayIndicator = ({
  restDaysRemaining = 2,
  onRestDayUsed = () => {},
  usedRestDayToday = false,
}) => {
  return (
    <RestDayIndicatorProvider
      restDaysRemaining={restDaysRemaining}
      usedRestDayToday={usedRestDayToday}
      onRestDayUsed={onRestDayUsed}
    >
      <RestDayIndicatorInner />
    </RestDayIndicatorProvider>
  );
};

export default RestDayIndicator;