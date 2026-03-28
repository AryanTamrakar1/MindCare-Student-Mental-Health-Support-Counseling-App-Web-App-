import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { useCounselorDashboard } from "../../hooks/counselorDashboard/useCounselorDashboard";

const PendingCountCard = () => {
  const navigate = useNavigate();
  const { pendingCount, loading } = useCounselorDashboard();

  let displayCount = "—";
  if (!loading) {
    if (pendingCount < 10) {
      displayCount = "0" + pendingCount;
    } else {
      displayCount = "" + pendingCount;
    }
  }

  function handleClick() {
    navigate("/pending-requests");
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="bg-white border border-[#DBEAFE] p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Clock size={20} className="text-amber-600" />
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#94A3B8]">
            Pending Requests
          </p>
          <p className="text-[34px] font-bold tracking-tight leading-tight text-amber-600">
            {displayCount}
          </p>
        </div>
      </div>

      <p className="text-[13px] text-[#94A3B8] font-medium border-t border-[#DBEAFE] pt-4 mb-5">
        Waiting for your review
      </p>

      <button
        onClick={handleClick}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 text-[14px] font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
      >
        Review Now <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default PendingCountCard;