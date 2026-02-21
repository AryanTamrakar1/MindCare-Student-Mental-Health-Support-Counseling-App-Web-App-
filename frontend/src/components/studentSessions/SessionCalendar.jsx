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

  const calSessions = [];
  for (let i = 0; i < sessions.length; i++) {
    if (
      sessions[i].status === "Approved" ||
      sessions[i].status === "Completed" ||
      sessions[i].status === "Missed"
    ) {
      calSessions.push(sessions[i]);
    }
  }

  const smap = {};
  for (let i = 0; i < calSessions.length; i++) {
    const s = calSessions[i];
    const p = parseDbDate(s.date);
    if (!p) continue;
    const k = `${p.y}-${p.m}-${p.d}`;
    if (!smap[k]) smap[k] = [];
    smap[k].push(s);
  }

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const totalCells = firstDay + daysInMonth;

  let trailingBlanks = 0;
  if (totalCells % 7 !== 0) {
    trailingBlanks = 7 - (totalCells % 7);
  }

  const handleDayClick = (day) => {
    const dow = new Date(y, m, day).getDay();
    if (dow === 0 || dow === 6) return;
    const k = `${y}-${m}-${day}`;
    if (!smap[k]) return;
    let next = k;
    if (selectedKey === k) next = null;
    setSelectedKey(next);
    if (next) {
      onDateClick(smap[k], { y, m, d: day });
    } else {
      onDateClick(null, null);
    }
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

  const leadingBlanks = [];
  for (let i = 0; i < firstDay; i++) {
    leadingBlanks.push(i);
  }

  const dayNumbers = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dayNumbers.push(i);
  }

  const trailingBlanksArr = [];
  for (let i = 0; i < trailingBlanks; i++) {
    trailingBlanksArr.push(i);
  }

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
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              Missed
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
        {leadingBlanks.map((i) => (
          <div
            key={`b-${i}`}
            className="h-[72px] border-r border-b border-gray-100"
          />
        ))}

        {dayNumbers.map((day) => {
          const k = `${y}-${m}-${day}`;
          const ds = smap[k] ? smap[k] : [];
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

          let dayBg = "";
          if (!isWeekend && isSel) dayBg = "bg-indigo-600";
          else if (!isWeekend && isToday) dayBg = "bg-indigo-50";
          else if (!isWeekend && ds.length > 0) dayBg = "hover:bg-gray-50";

          let dayCursor = "cursor-default";
          if (!isWeekend && ds.length > 0) dayCursor = "cursor-pointer";

          let dayBgFull = isWeekend
            ? "bg-gray-50/60 cursor-default"
            : `${dayCursor} ${dayBg}`;

          let numClass = "text-gray-700";
          if (isWeekend) numClass = "text-gray-300";
          else if (isSel) numClass = "bg-white text-indigo-600";
          else if (isToday) numClass = "bg-indigo-600 text-white";

          let topSessionBg = "bg-indigo-50 text-indigo-700";
          let topSessionDot = "bg-indigo-500";

          if (isSel) {
            topSessionBg = "bg-white/20 text-white";
            topSessionDot = "bg-white";
          } else if (topSession && topSession.status === "Approved") {
            topSessionBg = "bg-emerald-50 text-emerald-700";
            topSessionDot = "bg-emerald-500";
          } else if (topSession && topSession.status === "Missed") {
            topSessionBg = "bg-red-50 text-red-700";
            topSessionDot = "bg-red-500";
          }

          let topSessionName = "Session";
          if (
            topSession &&
            topSession.counselorId &&
            topSession.counselorId.name
          ) {
            topSessionName = topSession.counselorId.name.split(" ")[0];
          }

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-[72px] border-b border-gray-100 p-2 flex flex-col transition-all ${!isLastInRow ? "border-r" : ""} ${dayBgFull}`}
            >
              <span
                className={`text-sm font-black w-7 h-7 flex items-center justify-center rounded-full self-start ${numClass}`}
              >
                {day}
              </span>

              {!isWeekend && topSession && (
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black truncate mt-1 ${topSessionBg}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${topSessionDot}`}
                  />
                  <span className="truncate">{topSessionName}</span>
                  {extraCount > 0 && (
                    <span className="flex-shrink-0 ml-0.5">+{extraCount}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {trailingBlanksArr.map((i) => (
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
