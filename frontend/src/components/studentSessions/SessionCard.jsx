import React, { useState, useEffect } from "react";
import { Calendar, Clock, ArrowRight, FileText, Star } from "lucide-react";
import {
  parseTopics,
  fmtShort,
} from "../../utils/studentSessions/sessionhelper";
import axios from "../../api/axios";

const SessionCard = ({ session, onOpen, onViewSummary, onRate }) => {
  const topics = parseTopics(session.reason);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (session.status !== "Completed") return;
    const checkRating = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`/ratings/check/${session._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasRated(res.data.hasRated);
      } catch {
        setHasRated(false);
      }
    };
    checkRating();
  }, [session._id, session.status]);

  const statusConfig = {
    Approved: {
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    Completed: {
      pill: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dot: "bg-indigo-500",
    },
    Declined: {
      pill: "bg-red-50 text-red-600 border-red-200",
      dot: "bg-red-500",
    },
    Pending: {
      pill: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dot: "bg-yellow-400",
    },
  };

  const sc = statusConfig[session.status] || {
    pill: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden mb-4">
      <div className="flex items-center">
        <div className="flex items-center gap-3 px-5 py-4 w-64 flex-shrink-0 border-r border-gray-100">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
            {session.counselorId?.name?.charAt(0) || "C"}
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-800 text-sm truncate">
              {session.counselorId?.name || "Counselor"}
            </p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Counselor
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {topics.slice(0, 2).map((t, i) => (
                <span
                  key={i}
                  className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded border border-indigo-100 uppercase"
                >
                  {t}
                </span>
              ))}
              {topics.length > 2 && (
                <span className="text-[8px] text-gray-400 font-bold">
                  +{topics.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-4 border-r border-gray-100 flex-1">
          <Calendar size={14} className="text-indigo-400 mb-1" />
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Date
          </p>
          <p className="text-xs font-black text-gray-800 mt-0.5 whitespace-nowrap">
            {fmtShort(session.date)}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-4 border-r border-gray-100 flex-1">
          <Clock size={14} className="text-indigo-400 mb-1" />
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Time
          </p>
          <p className="text-xs font-black text-gray-800 mt-0.5 whitespace-nowrap">
            {session.timeSlot}
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-5 w-[420px] flex-shrink-0">
          <div className="flex justify-center">
            <span
              className={`flex items-center justify-center gap-1.5 text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-wider w-full ${sc.pill}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`}
              />
              {session.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpen(session)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all flex-1 whitespace-nowrap cursor-pointer"
            >
              View Detail <ArrowRight size={12} />
            </button>

            {session.status === "Completed" && (
              <>
                <button
                  onClick={() => onViewSummary(session)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider bg-teal-500 text-white hover:bg-teal-600 shadow-sm transition-all flex-1 whitespace-nowrap cursor-pointer"
                >
                  <FileText size={12} /> View Summary
                </button>

                <button
                  onClick={() => onRate && onRate(session)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex-1 whitespace-nowrap bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-500 cursor-pointer"
                >
                  <Star
                    size={12}
                    className={hasRated ? "fill-yellow-500" : "fill-yellow-800"}
                  />
                  {hasRated ? "Rated ✓" : "Rate Session"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
