import React from "react";
import { X, Clock, ArrowRight } from "lucide-react";
import {
  ordinal,
  MONTHS,
  parseTopics,
} from "../../utils/counselorSession/sessionhelper";

const DayPanel = ({ daySessions, dayInfo, onClose, onOpen }) => {
  if (!daySessions || daySessions.length === 0 || !dayInfo) return null;

  return (
    <div className="mt-4 bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center justify-between">
        <p className="text-sm font-black text-indigo-800">
          {dayInfo.d}
          {ordinal(dayInfo.d)} {MONTHS[dayInfo.m]} {dayInfo.y} —{" "}
          {daySessions.length} session{daySessions.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center transition-colors"
        >
          <X size={11} className="text-indigo-600" />
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {daySessions.map((s) => {
          const topics = parseTopics(s.reason);

          let statusColor = "text-indigo-600 bg-indigo-50 border-indigo-200";
          if (s.status === "Approved") {
            statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
          } else if (s.status === "Missed") {
            statusColor = "text-red-600 bg-red-50 border-red-200";
          }

          let studentInitial = "S";
          if (s.studentId && s.studentId.name && s.studentId.name.length > 0) {
            studentInitial = s.studentId.name.charAt(0);
          }

          let studentName = "Student";
          if (s.studentId && s.studentId.name) {
            studentName = s.studentId.name;
          }

          const visibleTopics = [];
          for (let i = 0; i < topics.length && i < 2; i++) {
            visibleTopics.push(topics[i]);
          }

          return (
            <div
              key={s._id}
              onClick={() => onOpen(s)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                {studentInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-800 text-sm">
                  {studentName}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                    <Clock size={9} />
                    {s.timeSlot}
                  </span>
                  {visibleTopics.map((t, i) => (
                    <span
                      key={i}
                      className="text-[8px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span
                className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase flex-shrink-0 ${statusColor}`}
              >
                {s.status === "Missed" ? "Missed" : s.status}
              </span>
              <ArrowRight
                size={14}
                className="text-gray-300 group-hover:text-indigo-500 transition-colors"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayPanel;
