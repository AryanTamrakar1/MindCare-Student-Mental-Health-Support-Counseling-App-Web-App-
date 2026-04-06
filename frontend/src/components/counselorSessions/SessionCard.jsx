import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Calendar, Clock, ArrowRight, PenLine } from "lucide-react";
import { parseTopics, fmtShort } from "../../utils/sessionHelper.js";

const SessionCard = ({ session, onOpen, onWriteSummary }) => {
  const [hasSummary, setHasSummary] = useState(false);
  const topics = parseTopics(session.reason);

  useEffect(() => {
    if (session.status !== "Completed") return;
    const check = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`/sessions/summary/${session._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasSummary(!!res.data.summary);
      } catch {
        setHasSummary(false);
      }
    };
    check();
  }, [session._id, session.status]);

  let scPill = "bg-[#F8FAFC] text-[#6B7280] border-[#E5E9F2]";
  let scDot = "bg-[#94A3B8]";

  if (session.status === "Approved") {
    scPill = "bg-emerald-50 text-emerald-700 border-emerald-200";
    scDot = "bg-emerald-500";
  } else if (session.status === "Completed") {
    scPill = "bg-blue-50 text-[#2563EB] border-blue-200";
    scDot = "bg-[#2563EB]";
  } else if (session.status === "Missed") {
    scPill = "bg-red-50 text-red-700 border-red-200";
    scDot = "bg-red-500";
  }

  const studentInitial = session.studentId?.name?.charAt(0) || "S";
  const studentName = session.studentId?.name || "Student";
  const visibleTopics = topics.slice(0, 2);

  let extraTopicsCount = 0;
  if (topics.length > 2) extraTopicsCount = topics.length - 2;

  let summaryButtonLabel = "Write Summary";
  if (hasSummary) summaryButtonLabel = "Edit Summary";

  const columns = "340px 1px 1fr 1px 1fr 1px 380px";

  return (
    <div
      className="bg-white border border-[#DBEAFE] hover:border-blue-300 transition-all overflow-x-auto"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="grid items-stretch" style={{ gridTemplateColumns: columns, minW: "760px" } }>

        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-11 h-11 bg-[#2563EB] text-white flex items-center justify-center font-bold text-[16px] flex-shrink-0">
            {studentInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#111827] truncate">{studentName}</p>
            <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider mt-0.5">Student</p>
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

        <div className="flex flex-col items-center justify-center px-6 py-4">
          <Calendar size={15} className="text-[#2563EB] mb-1.5" strokeWidth={2} />
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Date</p>
          <p className="text-[13px] font-semibold text-[#111827] mt-0.5 whitespace-nowrap">{fmtShort(session.date)}</p>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="flex flex-col items-center justify-center px-6 py-4">
          <Clock size={15} className="text-[#2563EB] mb-1.5" strokeWidth={2} />
          <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Time</p>
          <p className="text-[13px] font-semibold text-[#111827] mt-0.5 whitespace-nowrap">{session.timeSlot}</p>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="flex flex-col gap-3 px-5 py-4 justify-center">
          <span className={`flex items-center justify-center gap-1.5 text-[12px] font-semibold px-4 py-2 border w-full ${scPill}`}>
            <span className={`w-1.5 h-1.5 flex-shrink-0 ${scDot}`} />
            {session.status === "Missed" ? "Missed Session" : session.status}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpen(session)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition flex-1 whitespace-nowrap cursor-pointer"
            >
              View Details <ArrowRight size={13} strokeWidth={2} />
            </button>
            {session.status === "Completed" && (
              <button
                onClick={() => onWriteSummary(session)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition flex-1 whitespace-nowrap cursor-pointer"
              >
                <PenLine size={13} strokeWidth={2} />
                {summaryButtonLabel}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SessionCard;