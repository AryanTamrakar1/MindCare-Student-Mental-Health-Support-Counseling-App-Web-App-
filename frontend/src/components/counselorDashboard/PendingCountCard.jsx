import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import API from "../../api/axios";

const PendingCountCard = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/appointments/pending", {
          headers: { Authorization: "Bearer " + token },
        });
        setCount(res.data.length);
      } catch (err) {}
      setLoading(false);
    };
    fetchPending();
  }, []);

  let displayCount = "—";
  if (!loading) {
    displayCount = count < 10 ? "0" + count : "" + count;
  }

  function handleClick() {
    navigate("/pending-requests");
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Clock size={18} className="text-amber-600" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            Pending Requests
          </p>
          <p className="text-3xl font-black tracking-tight leading-tight text-amber-600">
            {displayCount}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium border-t border-slate-100 pt-4 mb-4">
        Waiting for your review
      </p>
      <button
        onClick={handleClick}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
      >
        Review Now <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default PendingCountCard;
