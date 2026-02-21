import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Calendar, Clock, ArrowRight, PenLine } from "lucide-react";
import { parseTopics, fmtShort } from "../../utils/counselorSession/sessionhelper";

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

  let scPill = "bg-gray-50 text-gray-600 border-gray-200";
  let scDot = "bg-gray-400";

  if (session.status === "Approved") {
    scPill = "bg-emerald-50 text-emerald-700 border-emerald-200";
    scDot = "bg-emerald-500";
  } else if (session.status === "Completed") {
    scPill = "bg-indigo-50 text-indigo-700 border-indigo-200";
    scDot = "bg-indigo-500";
  } else if (session.status === "Missed") {
    scPill = "bg-red-50 text-red-700 border-red-200";
    scDot = "bg-red-500";
  }

  const studentInitial = session.studentId?.name?.charAt(0) || "S";
  const studentName = session.studentId?.name || "Student";
  const visibleTopics = topics.slice(0, 2);
  const extraTopicsCount = topics.length > 2 ? topics.length - 2 : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden mb-4">
      <div className="flex items-center">
        <div className="flex items-center gap-3 px-5 py-4 w-64 flex-shrink-0 border-r border-gray-100">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
            {studentInitial}
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-800 text-sm truncate">{studentName}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Student</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {visibleTopics.map((t, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded border border-indigo-100 uppercase">
                  {t}
                </span>
              ))}
              {extraTopicsCount > 0 && (
                <span className="text-[8px] text-gray-400 font-bold">+{extraTopicsCount}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-4 border-r border-gray-100 flex-1">
          <Calendar size={14} className="text-indigo-400 mb-1.5" />
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</p>
          <p className="text-xs font-black text-gray-800 mt-0.5 whitespace-nowrap">{fmtShort(session.date)}</p>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-4 border-r border-gray-100 flex-1">
          <Clock size={14} className="text-indigo-400 mb-1.5" />
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Time</p>
          <p className="text-xs font-black text-gray-800 mt-0.5 whitespace-nowrap">{session.timeSlot}</p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 w-[380px] flex-shrink-0">
          <div className="flex justify-center">
            <span className={`flex items-center justify-center gap-1.5 text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-wider w-full ${scPill}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${scDot}`} />
              {session.status === "Missed" ? "Missed Session" : session.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpen(session)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all flex-1 whitespace-nowrap cursor-pointer"
            >
              View Detail <ArrowRight size={12} />
            </button>

            {session.status === "Completed" && (
              <button
                onClick={() => onWriteSummary(session)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider bg-teal-500 text-white hover:bg-teal-600 shadow-sm transition-all flex-1 whitespace-nowrap cursor-pointer"
              >
                <PenLine size={12} />
                {hasSummary ? "Edit Summary" : "Write Summary"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;