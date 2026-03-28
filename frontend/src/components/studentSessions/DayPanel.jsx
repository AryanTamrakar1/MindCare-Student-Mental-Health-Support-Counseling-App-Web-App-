import React from "react";
import { X, ArrowRight } from "lucide-react";
import { ordinal, MONTHS } from "../../utils/sessionHelper.js";
import { useStudentSessions } from "../../hooks/studentSessions/useStudentSessions";

const DayPanel = () => {
  const { dayData, setDayData, setSelectedSession } = useStudentSessions();

  if (!dayData || !dayData.sessions || dayData.sessions.length === 0 || !dayData.dayInfo) return null;

  const daySessions = dayData.sessions;
  const dayInfo = dayData.dayInfo;
  const onClose = () => setDayData(null);
  const onOpen = setSelectedSession;

  return (
    <div className="mt-4 bg-white border border-[#DBEAFE] overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#F1F5F9]">
        <p className="text-[14px] font-semibold text-[#111827]">
          {dayInfo.d}{ordinal(dayInfo.d)} {MONTHS[dayInfo.m]} {dayInfo.y}
          <span className="text-[#6B7280] font-medium ml-2">— {daySessions.length} session{daySessions.length > 1 ? "s" : ""}</span>
        </p>
        <button
          onClick={onClose}
          className="w-7 h-7 hover:bg-[#F1F5F9] flex items-center justify-center transition"
        >
          <X size={14} className="text-[#6B7280]" strokeWidth={2} />
        </button>
      </div>
      <div className="divide-y divide-[#F1F5F9]">
        {daySessions.map((s) => {
          let statusPill = "text-[#2563EB] bg-blue-50 border-blue-200";
          if (s.status === "Approved") {
            statusPill = "text-emerald-700 bg-emerald-50 border-emerald-200";
          } else if (s.status === "Missed") {
            statusPill = "text-red-600 bg-red-50 border-red-200";
          }

          let counselorInitial = "C";
          if (s.counselorId && s.counselorId.name) {
            if (s.counselorId.name.length > 0) {
              counselorInitial = s.counselorId.name.charAt(0);
            }
          }

          let counselorName = "Counselor";
          if (s.counselorId && s.counselorId.name) {
            counselorName = s.counselorId.name;
          }

          return (
            <div
              key={s._id}
              onClick={() => onOpen(s)}
              className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] cursor-pointer transition group"
            >
              <div className="w-9 h-9 bg-[#2563EB] text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0">
                {counselorInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#111827]">{counselorName}</p>
                <p className="text-[12px] text-[#6B7280] mt-0.5">{s.timeSlot}</p>
              </div>
              <span className={`text-[11px] font-semibold px-3 py-1 border ${statusPill}`}>
                {s.status === "Missed" ? "Missed" : s.status}
              </span>
              <ArrowRight size={14} className="text-[#CBD5E1] group-hover:text-[#2563EB] transition shrink-0" strokeWidth={2} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayPanel;