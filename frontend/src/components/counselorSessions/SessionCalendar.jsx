import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseDbDate, MONTHS, DAYS } from "../../utils/sessionHelper.js";

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
  for (let i = 0; i < firstDay; i++) leadingBlanks.push(i);

  const dayNumbers = [];
  for (let i = 1; i <= daysInMonth; i++) dayNumbers.push(i);

  const trailingBlanksArr = [];
  for (let i = 0; i < trailingBlanks; i++) trailingBlanksArr.push(i);

  return (
    <div className="bg-white border border-[#DBEAFE] overflow-hidden">
      <div className="px-8 pt-6 pb-5 flex items-center justify-between border-b border-[#E5E9F2]">
        <div>
          <p className="text-[19px] font-bold text-[#111827]">{MONTHS[m]} {y}</p>
          <p className="text-[14px] text-[#6B7280] mt-1">Your session schedule</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
              <span className="w-2 h-2 bg-emerald-500 inline-block" />
              Upcoming
            </span>
            <span className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              Completed
            </span>
            <span className="flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
              <span className="w-2 h-2 bg-red-400 inline-block" />
              Missed
            </span>
          </div>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="w-8 h-8 border border-[#E5E9F2] hover:bg-[#E5E9F2] flex items-center justify-center text-[#6B7280] transition">
              <ChevronLeft size={14} strokeWidth={2} />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 border border-[#E5E9F2] hover:bg-[#E5E9F2] flex items-center justify-center text-[#6B7280] transition">
              <ChevronRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[#E5E9F2]">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`py-3 text-center text-[11px] font-semibold uppercase tracking-wider border-r border-[#E5E9F2] last:border-r-0 ${
              i === 0 || i === 6 ? "text-[#6B7280]" : "text-[#111827]"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {leadingBlanks.map((i) => (
          <div key={`b-${i}`} className="h-[72px] border-r border-b border-[#E5E9F2]" />
        ))}

        {dayNumbers.map((day) => {
          const k = `${y}-${m}-${day}`;
          const ds = smap[k] ? smap[k] : [];
          const dow = new Date(y, m, day).getDay();
          const isWeekend = dow === 0 || dow === 6;
          const isToday = today.getDate() === day && today.getMonth() === m && today.getFullYear() === y;
          const isSel = selectedKey === k;
          const isLastInRow = (firstDay + day - 1) % 7 === 6;

          const visibleSessions = [];
          for (let i = 0; i < ds.length && i < 2; i++) visibleSessions.push(ds[i]);

          let extraCount = 0;
          if (ds.length - 2 > 0) extraCount = ds.length - 2;

          let dayBg = "";
          if (!isWeekend && isSel) dayBg = "bg-[#2563EB]";
          else if (!isWeekend && isToday) dayBg = "bg-[#EFF6FF]";
          else if (!isWeekend && ds.length > 0) dayBg = "hover:bg-[#F8FAFC]";

          let dayCursor = "cursor-default";
          if (!isWeekend && ds.length > 0) dayCursor = "cursor-pointer";

          let dayBgFull = isWeekend ? "bg-[#F8FAFC] cursor-default" : `${dayCursor} ${dayBg}`;

          let numClass = "text-[#374151]";
          if (isWeekend) numClass = "text-[#CBD5E1]";
          else if (isSel) numClass = "bg-white text-[#2563EB]";
          else if (isToday) numClass = "bg-[#2563EB] text-white";

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-[72px] border-b border-[#E5E9F2] p-2 flex flex-col transition-all ${!isLastInRow ? "border-r" : ""} ${dayBgFull}`}
            >
              <span className={`text-[13px] font-bold w-7 h-7 flex items-center justify-center self-start ${numClass}`}>
                {day}
              </span>

              {!isWeekend && visibleSessions.map((s, i) => {
                let sessionBg = "bg-white/20 text-white";
                if (!isSel) {
                  if (s.status === "Approved") sessionBg = "bg-emerald-50 text-emerald-700";
                  else if (s.status === "Missed") sessionBg = "bg-red-50 text-red-700";
                  else sessionBg = "bg-blue-50 text-[#2563EB]";
                }

                let dotColor = "bg-white";
                if (!isSel) {
                  if (s.status === "Approved") dotColor = "bg-emerald-500";
                  else if (s.status === "Missed") dotColor = "bg-red-500";
                  else dotColor = "bg-[#2563EB]";
                }

                let firstName = "Session";
                if (s.studentId && s.studentId.name) firstName = s.studentId.name.split(" ")[0];

                return (
                  <div key={i} className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold truncate mt-0.5 ${sessionBg}`}>
                    <span className={`w-1.5 h-1.5 flex-shrink-0 ${dotColor}`} />
                    <span className="truncate">{firstName}</span>
                  </div>
                );
              })}

              {!isWeekend && extraCount > 0 && (
                <span className={`text-[9px] font-semibold pl-1 ${isSel ? "text-blue-100" : "text-[#94A3B8]"}`}>
                  +{extraCount} more
                </span>
              )}
            </div>
          );
        })}

        {trailingBlanksArr.map((i) => (
          <div key={`t-${i}`} className={`h-[72px] border-b border-[#E5E9F2] ${i < trailingBlanks - 1 ? "border-r" : ""}`} />
        ))}
      </div>
    </div>
  );
};

export default SessionCalendar;