import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import API from "../../api/axios";

const AverageRatingCard = () => {
  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/ratings/my-ratings", {
          headers: { Authorization: "Bearer " + token },
        });
        setRatingData(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchRatings();
  }, []);

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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
          <Star size={18} className="text-yellow-500" fill="#eab308" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            Average Rating
          </p>
          <p className="text-3xl font-black tracking-tight leading-tight text-slate-800">
            {displayRating}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 flex items-center justify-between mb-5">
        <p className="text-xs text-slate-400 font-medium">{displayTotal}</p>
        <div className="flex gap-0.5">
          {stars.map(function (s) {
            const filled = s <= filledCount;
            const fillColor = filled ? "#facc15" : "none";
            const starClass = filled ? "text-yellow-400" : "text-slate-200";
            return (
              <Star key={s} size={13} className={starClass} fill={fillColor} />
            );
          })}
        </div>
      </div>

      <button
        onClick={handleClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
      >
        View Ratings <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default AverageRatingCard;
