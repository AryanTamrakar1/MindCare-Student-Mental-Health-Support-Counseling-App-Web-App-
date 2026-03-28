import React from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { parseTopics, fmtShort } from "../../utils/sessionHelper.js";
import { useStudentSessions } from "../../hooks/studentSessions/useStudentSessions";

const SessionCard = ({ session }) => {
  const { setSelectedSession } = useStudentSessions();
  const onOpen = setSelectedSession;

  const topics = parseTopics(session.reason);

  let scPill = "bg-[#F8FAFC] text-[#6B7280] border-[#E5E9F2]";
  let scDot = "bg-[#94A3B8]";

  if (session.status === "Approved") {
    scPill = "bg-emerald-50 text-emerald-700 border-emerald-200";
    scDot = "bg-emerald-500";
  } else if (session.status === "Pending") {
    scPill = "bg-yellow-50 text-yellow-700 border-yellow-200";
    scDot = "bg-yellow-400";
  } else if (session.status === "Declined") {
    scPill = "bg-[#F8FAFC] text-[#6B7280] border-[#E5E9F2]";
    scDot = "bg-[#94A3B8]";
  } else if (session.status === "Missed") {
    scPill = "bg-red-50 text-red-700 border-red-200";
    scDot = "bg-red-500";
  }

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

  const columns = "340px 1px 1fr 1px 1fr 1px 380px";

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
          <button
            onClick={() => onOpen(session)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition w-full cursor-pointer"
          >
            View Details <ArrowRight size={13} strokeWidth={2} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionCard;