import React, { useState, useEffect } from "react";
import { Calendar, Clock, Video, CheckCircle, XCircle, X, AlertCircle, Star } from "lucide-react";
import { isSessionTime, parseTopics, parseReason, fmtLong } from "../../utils/sessionHelper.js";
import axios from "../../api/axios";
import { useStudentSessions } from "../../hooks/studentSessions/useStudentSessions";

const DetailModal = () => {
  const { selectedSession: session, setSelectedSession, handleJoin, setRatingSession } = useStudentSessions();
  const onClose = () => setSelectedSession(null);
  const onJoin = handleJoin;
  const onRate = setRatingSession;

  if (!session) return null;

  const canJoin = isSessionTime(session.date, session.timeSlot);
  const topics = parseTopics(session.reason);
  const reasonText = parseReason(session.reason);
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
  } else if (session.status === "Declined") {
    scColor = "text-red-700";
    scBg = "bg-red-500";
    scLight = "bg-red-50 border-red-200";
  } else if (session.status === "Pending") {
    scColor = "text-yellow-700";
    scBg = "bg-yellow-400";
    scLight = "bg-yellow-50 border-yellow-200";
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

  let joinButtonText = "Join Meeting Now";
  if (!canJoin) {
    joinButtonText = "Meeting Not Started";
  }

  let showApproved = false;
  if (session.status === "Approved") {
    showApproved = true;
  }

  let showPending = false;
  if (session.status === "Pending") {
    showPending = true;
  }

  let showCompleted = false;
  if (session.status === "Completed") {
    showCompleted = true;
  }

  let showDeclined = false;
  if (session.status === "Declined") {
    showDeclined = true;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white border border-[#E2E8F0] shadow-2xl w-full max-w-2xl overflow-hidden">

        <div className="px-8 pt-7 pb-6 flex items-start justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2563EB] text-white flex items-center justify-center font-bold text-[18px] flex-shrink-0">
              {counselorInitial}
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">{counselorName}</h2>
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
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">Reason for Appointment</p>
              <p className="text-[13px] text-[#374151] font-medium leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] px-5 py-4 whitespace-pre-wrap">
                {reasonText}
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3">
            {showApproved && (
              <button
                onClick={() => { onJoin(session._id, session.zoomLink); onClose(); }}
                disabled={!canJoin}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition ${
                  canJoin ? "bg-[#2563EB] text-white hover:bg-blue-700" : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                }`}
              >
                <Video size={15} strokeWidth={2} />
                {joinButtonText}
              </button>
            )}
            {showPending && (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-50 border border-yellow-200">
                <AlertCircle size={15} className="text-yellow-600" strokeWidth={2} />
                <span className="text-yellow-700 font-semibold text-[13px]">Waiting for Counselor Approval</span>
              </div>
            )}
            {showCompleted && (
              <>
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200">
                  <CheckCircle size={15} className="text-[#2563EB]" strokeWidth={2} />
                  <span className="text-[#2563EB] font-semibold text-[13px]">Session Completed</span>
                </div>
                <button
                  onClick={() => { onClose(); if (onRate) onRate(session); }}
                  className="flex items-center justify-center gap-1.5 px-5 py-3 text-[13px] font-semibold bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition flex-shrink-0"
                >
                  <Star size={14} className={hasRated ? "fill-yellow-600" : "fill-yellow-800"} strokeWidth={0} />
                  {hasRated ? "Rated" : "Rate Session"}
                </button>
              </>
            )}
            {showDeclined && (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 border border-red-200">
                <XCircle size={15} className="text-red-500" strokeWidth={2} />
                <span className="text-red-700 font-semibold text-[13px]">This Session was Declined</span>
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