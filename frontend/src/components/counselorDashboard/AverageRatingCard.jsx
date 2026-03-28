import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { useCounselorDashboard } from "../../hooks/counselorDashboard/useCounselorDashboard";

const AverageRatingCard = () => {
  const navigate = useNavigate();
  const { ratingData, loading } = useCounselorDashboard();

  let displayRating = "—";
  let displayTotal = "No ratings yet";
  let filledCount = 0;

  if (!loading && ratingData && ratingData.totalRatings > 0) {
    displayRating = ratingData.averages.overall;
    displayTotal = "From " + ratingData.totalRatings + " sessions";
    filledCount = Math.round(ratingData.averages.overall);
  }

  const stars = [1, 2, 3, 4, 5];

  function handleClick() {
    navigate("/counselor-ratings");
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="bg-white border border-[#DBEAFE] p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0">
          <Star size={20} className="text-yellow-500" fill="#EAB308" />
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#94A3B8]">
            Average Rating
          </p>
          <p className="text-[34px] font-bold tracking-tight leading-tight text-[#0F172A]">
            {displayRating}
          </p>
        </div>
      </div>

      <div className="border-t border-[#DBEAFE] pt-4 flex items-center justify-between mb-5">
        <p className="text-[13px] text-[#94A3B8] font-medium">{displayTotal}</p>
        <div className="flex gap-0.5">
          {stars.map(function (s) {
            let starClass = "text-[#E2E8F0]";
            let starFill = "none";
            if (s <= filledCount) {
              starClass = "text-yellow-400";
              starFill = "#FACC15";
            }
            return (
              <Star
                key={s}
                size={15}
                className={starClass}
                fill={starFill}
              />
            );
          })}
        </div>
      </div>

      <button
        onClick={handleClick}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 text-[14px] font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
      >
        View Ratings <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default AverageRatingCard;