import React from "react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
} from "lucide-react";
import {
  isSessionTime,
  parseTopics,
  parseReason,
  fmtLong,
} from "../../utils/studentSessions/sessionhelper";

const DetailModal = ({ session, onClose, onJoin }) => {
  if (!session) return null;
  const canJoin = isSessionTime(session.date, session.timeSlot);
  const topics = parseTopics(session.reason);
  const reasonText = parseReason(session.reason);

  const statusConfig = {
    Approved: {
      color: "text-emerald-700",
      bg: "bg-emerald-500",
      light: "bg-emerald-50 border-emerald-200",
    },
    Completed: {
      color: "text-indigo-700",
      bg: "bg-indigo-500",
      light: "bg-indigo-50 border-indigo-200",
    },
    Declined: {
      color: "text-red-700",
      bg: "bg-red-500",
      light: "bg-red-50 border-red-200",
    },
    Pending: {
      color: "text-yellow-700",
      bg: "bg-yellow-400",
      light: "bg-yellow-50 border-yellow-200",
    },
  };
  const sc = statusConfig[session.status] || {
    color: "text-gray-600",
    bg: "bg-gray-400",
    light: "bg-gray-50 border-gray-200",
  };

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
        <div className="px-8 pt-8 pb-6 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-3xl flex-shrink-0">
              {session.counselorId?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                {session.counselorId?.name || "Counselor"}
              </h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${sc.light} ${sc.color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${sc.bg}`} />
                  {session.status}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Counseling Session
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="mx-8 border-t border-gray-100" />

        <div className="px-8 py-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-5 border border-gray-100">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Date
              </p>
              <p className="text-base font-black text-gray-800 mt-0.5">
                {fmtLong(session.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-5 border border-gray-100">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Time
              </p>
              <p className="text-base font-black text-gray-800 mt-0.5">
                {session.timeSlot}
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6">
          {topics.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Focus Areas / Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((t, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 text-indigo-700 text-xs font-black px-4 py-2 rounded-xl border border-indigo-100 uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {reasonText && (
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Reason for Appointment
              </p>
              <p className="text-base text-gray-600 font-medium leading-relaxed bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
                {reasonText}
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            {session.status === "Approved" && (
              <button
                onClick={() => {
                  onJoin(session._id, session.zoomLink);
                  onClose();
                }}
                disabled={!canJoin}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all
                  ${canJoin ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <Video size={18} />
                {canJoin ? "Join Meeting Now" : "Meeting Not Started"}
              </button>
            )}

            {session.status === "Pending" && (
              <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-yellow-100 border border-yellow-200">
                <AlertCircle size={18} className="text-yellow-600" />
                <span className="text-yellow-800 font-black text-sm uppercase">
                  Waiting for Counselor Approval
                </span>
              </div>
            )}

            {session.status === "Completed" && (
              <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-100 border border-indigo-200">
                <CheckCircle size={18} className="text-indigo-600" />
                <span className="text-indigo-800 font-black text-sm uppercase">
                  Session Successfully Completed
                </span>
              </div>
            )}

            {session.status === "Declined" && (
              <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-100 border border-red-200">
                <XCircle size={18} className="text-red-600" />
                <span className="text-red-800 font-black text-sm uppercase">
                  This Session was Declined
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl text-sm font-black text-gray-600 bg-gray-200 hover:bg-gray-300 uppercase tracking-wider transition-all flex-shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
