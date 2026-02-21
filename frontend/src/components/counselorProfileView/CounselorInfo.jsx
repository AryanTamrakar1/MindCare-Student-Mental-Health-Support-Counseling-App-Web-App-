const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const CounselorInfo = ({ counselor, scheduleMap, topics, qualifications }) => {
  return (
    <div className="p-10 px-12 space-y-10">
      <div>
        <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
          About Counselor
        </h4>
        <div className="bg-slate-50 p-7 rounded-3xl border border-slate-100 shadow-inner">
          {counselor.bio ? (
            counselor.bio
              .split(/\n+/)
              .filter((p) => p.trim())
              .map((para, i) => (
                <p
                  key={i}
                  className="text-slate-600 text-base leading-relaxed font-medium text-justify mb-4 last:mb-0"
                >
                  {para.trim()}
                </p>
              ))
          ) : (
            <p className="text-slate-600 text-base leading-relaxed font-medium text-justify">
              No biography provided.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-20">
        <div>
          <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
            Specialization
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {topics.map((s, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl text-xs font-bold border border-indigo-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
            Education
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {qualifications.map((q, i) => (
              <span
                key={i}
                className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl text-xs font-bold border border-emerald-100"
              >
                ✓ {q}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 bg-[#f8fafc] -mx-12 px-12 pb-12">
        <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-8 tracking-[0.2em] pt-4 text-center">
          Weekly Consultation Schedule
        </h4>
        <div className="grid grid-cols-5 gap-6">
          {daysOrder.map((day) => (
            <div
              key={day}
              className="rounded-3xl p-5 border bg-white border-slate-200 shadow-sm flex flex-col items-center"
            >
              <p className="text-[10px] font-black text-indigo-600 uppercase mb-5 text-center border-b-2 border-indigo-50 w-full pb-3">
                {day}
              </p>
              <div className="space-y-3 w-full">
                {timeSlots.map((slot, i) => {
                  const hasSession = scheduleMap[day]?.includes(slot);
                  return hasSession ? (
                    <div
                      key={i}
                      className="bg-indigo-600 text-white text-[9px] font-black p-3 rounded-xl text-center shadow-md shadow-indigo-100 h-[42px] flex items-center justify-center"
                    >
                      {slot}
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="bg-slate-50 text-slate-300 text-[9px] font-black p-3 rounded-xl text-center border border-dashed border-slate-200 h-[42px] flex items-center justify-center"
                    >
                      No Session
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CounselorInfo;
