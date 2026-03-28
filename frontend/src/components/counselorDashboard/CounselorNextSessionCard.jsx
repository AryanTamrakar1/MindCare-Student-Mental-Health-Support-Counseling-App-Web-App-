import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Clock, ArrowRight } from "lucide-react";
import { useCounselorDashboard } from "../../hooks/counselorDashboard/useCounselorDashboard";

const CounselorNextSessionCard = () => {
  const navigate = useNavigate();
  const { allSessions, loading } = useCounselorDashboard();

  let nextSession = null;
  for (let i = 0; i < allSessions.length; i++) {
    if (allSessions[i].status === "Approved") {
      nextSession = allSessions[i];
      break;
    }
  }

  function handleClick() {
    navigate("/counselor-sessions");
  }

  let studentName = "None";
  if (nextSession && nextSession.studentId && nextSession.studentId.name) {
    studentName = nextSession.studentId.name;
  }

  let displayValue = "—";
  if (!loading) {
    displayValue = studentName;
  }

  let subtitleText = "Your schedule is clear";
  if (!loading && nextSession) {
    subtitleText = "Upcoming approved session";
  }

  let buttonText = "View Sessions";
  if (!loading && nextSession) {
    buttonText = "View Session";
  }

  const hasSession = !loading && nextSession !== null;

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="bg-white border border-[#DBEAFE] p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center shrink-0">
          <CalendarClock size={20} className="text-[#2563EB]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#94A3B8]">
            Next Session
          </p>
          <p className="text-[34px] font-bold tracking-tight leading-tight text-[#2563EB] truncate max-w-[160px]">
            {displayValue}
          </p>
        </div>
      </div>

      {hasSession && (
        <div className="flex gap-2 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-[#F8FAFF] border border-[#DBEAFE] px-3 py-2">
            <CalendarClock size={13} className="text-[#2563EB] shrink-0" />
            <span className="text-[13px] font-semibold text-[#374151] truncate">
              {nextSession.date}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-[#F8FAFF] border border-[#DBEAFE] px-3 py-2">
            <Clock size={13} className="text-[#2563EB] shrink-0" />
            <span className="text-[13px] font-semibold text-[#374151] truncate">
              {nextSession.timeSlot}
            </span>
          </div>
        </div>
      )}

      <p className="text-[13px] text-[#94A3B8] font-medium border-t border-[#DBEAFE] pt-4 mb-5">
        {subtitleText}
      </p>

      {!loading && (
        <button
          onClick={handleClick}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 text-[14px] font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
        >
          {buttonText} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
};

export default CounselorNextSessionCard;