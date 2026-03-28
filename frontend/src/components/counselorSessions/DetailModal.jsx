import React from "react";
import { Calendar, Clock, CheckCircle, X, PlayCircle, StopCircle } from "lucide-react";
import { isSessionTime, parseTopics, parseReason, fmtLong } from "../../utils/sessionHelper.js";

const DetailModal = ({ session, onClose, onStart, onEnd }) => {
  if (!session) return null;

  const canStart = isSessionTime(session.date, session.timeSlot);
  const topics = parseTopics(session.reason);
  const reasonText = parseReason(session.reason);

  let scColor = "text-[#6B7280]";
  let scBg = "bg-[#94A3B8]";
  let scLight = "bg-[#F8FAFC] border-[#E2E8F0]";

  if (session.status === "Approved") {
    scColor = "text-emerald-700";
    scBg = "bg-emerald-500";
    scLight = "bg-emerald-50 border-emerald-200";
  } else if (session.status === "Completed") {
    scColor = "text-[#2563EB]";
    scBg = "bg-[#2563EB]";
    scLight = "bg-blue-50 border-blue-200";
  }

  let studentInitial = "S";
  if (session.studentId && session.studentId.name && session.studentId.name.length > 0) {
    studentInitial = session.studentId.name.charAt(0);
  }

  let studentName = "Student";
  if (session.studentId && session.studentId.name) studentName = session.studentId.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white border border-[#E2E8F0] shadow-2xl w-full max-w-2xl overflow-hidden">

        <div className="px-8 pt-7 pb-6 flex items-start justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2563EB] text-white flex items-center justify-center font-bold text-[18px] flex-shrink-0">
              {studentInitial}
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">{studentName}</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 border ${scLight} ${scColor}`}>
                  <span className={`w-1.5 h-1.5 ${scBg}`} />
                  {session.status}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-widest">Counseling Session</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-[#F1F5F9] flex items-center justify-center transition flex-shrink-0">
            <X size={15} className="text-[#6B7280]" strokeWidth={2} />
          </button>
        </div>

        <div className="px-8 py-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4">
            <div className="w-9 h-9 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Date</p>
              <p className="text-[14px] font-semibold text-[#111827] mt-0.5">{fmtLong(session.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4">
            <div className="w-9 h-9 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Time</p>
              <p className="text-[14px] font-semibold text-[#111827] mt-0.5">{session.timeSlot}</p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-7 flex flex-col gap-5">
          {topics.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">Topics for this session</p>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, i) => (
                  <span key={i} className="bg-blue-50 text-[#2563EB] text-[12px] font-semibold px-3 py-1.5 border border-blue-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {reasonText && (
            <div>
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">Student's Reason for Appointment</p>
              <p className="text-[13px] text-[#374151] font-medium leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4 whitespace-pre-wrap">
                {reasonText}
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3">
            {session.status === "Approved" && (
              <>
                <button
                  onClick={() => { onStart(session._id, session.startLink); onClose(); }}
                  disabled={!canStart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition ${
                    canStart ? "bg-[#2563EB] text-white hover:bg-blue-700" : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                  }`}
                >
                  <PlayCircle size={15} strokeWidth={2} />
                  {canStart ? "Start Session Now" : "Session Not Available"}
                </button>
                {canStart && (
                  <button
                    onClick={() => { onEnd(session._id); onClose(); }}
                    className="flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition flex-shrink-0"
                  >
                    <StopCircle size={15} strokeWidth={2} />
                    End Session
                  </button>
                )}
              </>
            )}
            {session.status === "Completed" && (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200">
                <CheckCircle size={15} className="text-[#2563EB]" strokeWidth={2} />
                <span className="text-[#2563EB] font-semibold text-[13px]">Session Completed</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="px-6 py-3 text-[13px] font-semibold text-[#6B7280] bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] transition flex-shrink-0">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;