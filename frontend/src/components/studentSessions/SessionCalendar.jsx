import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  parseDbDate,
  MONTHS,
  DAYS,
} from "../../utils/studentSessions/sessionhelper";

const SessionCalendar = ({ sessions, onDateClick }) => {
  const [view, setView] = useState(new Date());
  const [selectedKey, setSelectedKey] = useState(null);

  const y = view.getFullYear();
  const m = view.getMonth();
  const today = new Date();

  const calSessions = sessions.filter(
    (s) => s.status === "Approved" || s.status === "Completed",
  );

  const smap = {};
  calSessions.forEach((s) => {
    const p = parseDbDate(s.date);
    if (!p) return;
    const k = `${p.y}-${p.m}-${p.d}`;
    if (!smap[k]) smap[k] = [];
    smap[k].push(s);
  });

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const totalCells = firstDay + daysInMonth;
  const trailingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const handleDayClick = (day) => {
    const dow = new Date(y, m, day).getDay();
    if (dow === 0 || dow === 6) return;

    const k = `${y}-${m}-${day}`;
    if (!smap[k]) return;
    const next = selectedKey === k ? null : k;
    setSelectedKey(next);
    onDateClick(next ? smap[k] : null, next ? { y, m, d: day } : null);
  };

  const prevMonth = () => {
    setSelectedKey(null);
    onDateClick(null, null);
    setView(new Date(y, m - 1, 1));
  };
  const nextMonth = () => {
    setSelectedKey(null);
    onDateClick(null, null);
    setView(new Date(y, m + 1, 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">
            Schedule
          </p>
          <h3 className="text-white text-xl font-black">
            {MONTHS[m]} {y}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Upcoming
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-indigo-300 inline-block" />
              Completed
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`py-3 text-center text-[10px] font-black uppercase tracking-wider border-r border-gray-100 last:border-r-0
            ${i === 0 || i === 6 ? "text-gray-300" : "text-gray-400"}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <div
              key={`b-${i}`}
              className="h-[72px] border-r border-b border-gray-100"
            />
          ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const k = `${y}-${m}-${day}`;
          const ds = smap[k] || [];
          const dow = new Date(y, m, day).getDay();
          const isWeekend = dow === 0 || dow === 6;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === m &&
            today.getFullYear() === y;
          const isSel = selectedKey === k;
          const isLastInRow = (firstDay + day - 1) % 7 === 6;

          const topSession = ds[0];
          const extraCount = ds.length - 1;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-[72px] border-b border-gray-100 p-2 flex flex-col transition-all
                ${!isLastInRow ? "border-r" : ""}
                ${isWeekend ? "bg-gray-50/60 cursor-default" : ds.length ? "cursor-pointer" : "cursor-default"}
                ${!isWeekend && isSel ? "bg-indigo-600" : !isWeekend && isToday ? "bg-indigo-50" : !isWeekend && ds.length ? "hover:bg-gray-50" : ""}
              `}
            >
              <span
                className={`text-sm font-black w-7 h-7 flex items-center justify-center rounded-full self-start
                ${
                  isWeekend
                    ? "text-gray-300"
                    : isSel
                      ? "bg-white text-indigo-600"
                      : isToday
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700"
                }
              `}
              >
                {day}
              </span>

              {!isWeekend && topSession && (
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black truncate mt-1
                  ${
                    isSel
                      ? "bg-white/20 text-white"
                      : topSession.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-indigo-50 text-indigo-700"
                  }
                `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                    ${isSel ? "bg-white" : topSession.status === "Approved" ? "bg-emerald-500" : "bg-indigo-500"}
                  `}
                  />
                  <span className="truncate">
                    {topSession.counselorId?.name?.split(" ")[0] || "Session"}
                  </span>
                  {extraCount > 0 && (
                    <span className="flex-shrink-0 ml-0.5">+{extraCount}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {Array(trailingBlanks)
          .fill(null)
          .map((_, i) => (
            <div
              key={`t-${i}`}
              className={`h-[72px] border-b border-gray-100 ${i < trailingBlanks - 1 ? "border-r" : ""}`}
            />
          ))}
      </div>
    </div>
  );
};

export default SessionCalendar;
