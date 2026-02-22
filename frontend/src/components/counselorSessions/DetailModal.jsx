import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  X,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import {
  isSessionTime,
  parseTopics,
  parseReason,
  fmtLong,
} from "../../utils/counselorSession/sessionhelper";

const DetailModal = ({ session, onClose, onStart, onEnd }) => {
  if (!session) return null;

  const canStart = isSessionTime(session.date, session.timeSlot);
  const topics = parseTopics(session.reason);
  const reasonText = parseReason(session.reason);

  let scColor = "text-gray-600";
  let scBg = "bg-gray-400";
  let scLight = "bg-gray-50 border-gray-200";

  if (session.status === "Approved") {
    scColor = "text-emerald-700";
    scBg = "bg-emerald-500";
    scLight = "bg-emerald-50 border-emerald-200";
  } else if (session.status === "Completed") {
    scColor = "text-indigo-700";
    scBg = "bg-indigo-500";
    scLight = "bg-indigo-50 border-indigo-200";
  }

  let studentInitial = "S";
  if (
    session.studentId &&
    session.studentId.name &&
    session.studentId.name.length > 0
  ) {
    studentInitial = session.studentId.name.charAt(0);
  }

  let studentName = "Student";
  if (session.studentId && session.studentId.name) {
    studentName = session.studentId.name;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
      >
        <div className="px-8 pt-10 pb-7 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
              {studentInitial}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                {studentName}
              </h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${scLight} ${scColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${scBg}`} />
                  {session.status}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Counseling Session
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="mx-8 border-t border-gray-100" />

        <div className="px-8 py-7 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-6 border border-gray-100">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Date
              </p>
              <p className="text-sm font-black text-gray-800 mt-0.5">
                {fmtLong(session.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-6 border border-gray-100">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Time
              </p>
              <p className="text-sm font-black text-gray-800 mt-0.5">
                {session.timeSlot}
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-10 flex flex-col gap-6">
          {topics.length > 0 && (
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Choose Topics For this Session
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-indigo-100 uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {reasonText && (
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                The Student's Reason for the Appointment
              </p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50 rounded-xl px-5 py-5 border border-gray-100 whitespace-pre-wrap text-justify">
                {reasonText}
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            {session.status === "Approved" && (
              <>
                <button
                  onClick={() => {
                    onStart(session._id, session.startLink);
                    onClose();
                  }}
                  disabled={!canStart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                    ${canStart ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  <PlayCircle size={16} />
                  {canStart ? "Start Session Now" : "Session Not Available"}
                </button>
                {canStart && (
                  <button
                    onClick={() => {
                      onEnd(session._id);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-xs font-black uppercase bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition-all flex-shrink-0"
                  >
                    <StopCircle size={16} />
                    End Session
                  </button>
                )}
              </>
            )}
            {session.status === "Completed" && (
              <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-100 border border-indigo-200">
                <CheckCircle size={16} className="text-indigo-600" />
                <span className="text-indigo-800 font-black text-xs uppercase">
                  Session Completed
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-7 py-4 rounded-xl text-xs font-black text-gray-600 bg-gray-200 hover:bg-gray-300 uppercase tracking-wider transition-all flex-shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;