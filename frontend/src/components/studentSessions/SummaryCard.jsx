import React, { useState, useEffect } from "react";
import { Calendar, Clock, ArrowRight, FileText, Star } from "lucide-react";
import { parseTopics, fmtShort } from "../../utils/sessionHelper.js";
import axios from "../../api/axios";
import { useStudentSessions } from "../../hooks/studentSessions/useStudentSessions";

const SummaryCard = ({ session }) => {
  const { setSelectedSession, setSummarySession, setRatingSession } = useStudentSessions();
  const onOpen = setSelectedSession;
  const onViewSummary = setSummarySession;
  const onRate = setRatingSession;

  const topics = parseTopics(session.reason);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
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
  }, [session._id]);

  let counselorInitial = "C";
  if (session.counselorId && session.counselorId.name) {
    if (session.counselorId.name.length > 0) {
      counselorInitial = session.counselorId.name.charAt(0);
    }
  }

  let counselorName = "Counselor";
  if (session.counselorId && session.counselorId.name) {
    counselorName = session.counselorId.name;
  }

  const visibleTopics = [];
  for (let i = 0; i < topics.length && i < 2; i++) {
    visibleTopics.push(topics[i]);
  }
  const extraTopicsCount = topics.length > 2 ? topics.length - 2 : 0;

  let starFillClass = "fill-yellow-800";
  if (hasRated) {
    starFillClass = "fill-yellow-500";
  }

  const columns = "340px 1px 1fr 1px 1fr 1px 420px";

  return (
    <div
      className="bg-white border border-[#DBEAFE] overflow-hidden hover:border-blue-300 transition-all"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="grid items-stretch" style={{ gridTemplateColumns: columns }}>

        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-11 h-11 bg-[#2563EB] text-white flex items-center justify-center font-bold text-[16px] flex-shrink-0">
            {counselorInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#111827] truncate">{counselorName}</p>
            <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mt-0.5">Counselor</p>
            <div className="flex items-center gap-1 mt-1.5">
              {visibleTopics.map((t, i) => (
                <span key={i} className="bg-blue-50 text-[#2563EB] text-[10px] font-semibold px-2 py-0.5 border border-blue-100 whitespace-nowrap">
                  {t}
                </span>
              ))}
              {extraTopicsCount > 0 && (
                <span className="text-[11px] text-[#94A3B8] font-medium flex-shrink-0">+{extraTopicsCount}</span>
              )}
            </div>
          </div>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="flex flex-col items-center justify-center px-4 py-4">
          <Calendar size={15} className="text-[#2563EB] mb-1.5" strokeWidth={2} />
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Date</p>
          <p className="text-[13px] font-semibold text-[#111827] mt-0.5 whitespace-nowrap">{fmtShort(session.date)}</p>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="flex flex-col items-center justify-center px-4 py-4">
          <Clock size={15} className="text-[#2563EB] mb-1.5" strokeWidth={2} />
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Time</p>
          <p className="text-[13px] font-semibold text-[#111827] mt-0.5 whitespace-nowrap">{session.timeSlot}</p>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="flex flex-col gap-3 px-5 py-4 justify-center">
          <span className="flex items-center justify-center gap-1.5 text-[12px] font-semibold px-4 py-2 border w-full bg-blue-50 text-[#2563EB] border-blue-200">
            <span className="w-1.5 h-1.5 flex-shrink-0 bg-[#2563EB]" />
            Completed
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpen(session)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition flex-1 whitespace-nowrap cursor-pointer"
            >
              View Details <ArrowRight size={13} strokeWidth={2} />
            </button>
            <button
              onClick={() => onViewSummary(session)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition flex-1 whitespace-nowrap cursor-pointer"
            >
              <FileText size={13} strokeWidth={2} /> Summary
            </button>
            <button
              onClick={() => { if (onRate) onRate(session); }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition flex-1 whitespace-nowrap cursor-pointer"
            >
              <Star size={13} className={starFillClass} strokeWidth={0} />
              {hasRated ? "Rated" : "Rate"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SummaryCard;