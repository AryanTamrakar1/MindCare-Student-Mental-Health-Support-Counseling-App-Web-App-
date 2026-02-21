import { Star, Users, GraduationCap } from "lucide-react";

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

const ProfilePreview = ({
  userInitial,
  userName,
  previewProfTitle,
  previewExperience,
  previewBio,
  previewSpecializations,
  previewEducation,
  previewAvailability,
}) => {
  const bioParagraphs = [];
  if (previewBio) {
    const lines = previewBio.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed) {
        bioParagraphs.push(trimmed);
      }
    }
  }

  return (
    <div className="w-full mt-10 pt-10 border-t-2 border-slate-300">
      <div className="flex flex-col items-center mb-8 text-center">
        <span className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.4em]">
          Student View Preview
        </span>
        <p className="text-gray-500 text-sm mt-2">
          This is how students will see your profile after you save
        </p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm mb-10 w-full">
        <div className="flex justify-between items-center p-8 px-10 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black border border-indigo-100">
              {userInitial}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight">
                {userName}
              </h1>
              <p className="text-gray-500 font-bold text-sm">
                {previewProfTitle || "Professional Counselor"}
              </p>
              <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-1.5 block">
                ● Available
              </span>
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-12 py-4 rounded-2xl text-xs font-black shadow-lg opacity-60 cursor-not-allowed">
            Request Session
          </button>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-100 bg-[#f8fafc]">
          <div className="flex flex-col items-center justify-center py-8 border-r-2 border-slate-200 gap-1.5">
            <div className="flex items-center gap-2">
              <GraduationCap size={22} className="text-indigo-400" />
              <span className="text-xl font-black text-gray-800">
                {previewExperience || 0}+ Yrs
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Experience
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-8 border-r-2 border-slate-200 gap-1.5">
            <div className="flex items-center gap-2">
              <Users size={22} className="text-indigo-400" />
              <span className="text-xl font-black text-gray-800">0</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Students Helped
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-8 gap-1.5">
            <div className="flex items-center gap-2">
              <Star size={22} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-black text-gray-800">0.0</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Rating
            </p>
          </div>
        </div>

        <div className="p-10 px-12 space-y-10">
          <div>
            <h4 className="text-[11px] font-black text-indigo-600 uppercase mb-4 tracking-[0.2em]">
              About Counselor
            </h4>
            <div className="bg-slate-50 p-7 rounded-3xl border border-slate-100 shadow-inner">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-slate-600 text-base leading-relaxed font-medium text-justify mb-4 last:mb-0"
                  >
                    {para}
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
                {previewSpecializations.map((s, i) => (
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
                {previewEducation.map((e, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl text-xs font-bold border border-emerald-100"
                  >
                    ✓ {e}
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
                    {timeSlots.map((slotTime, idx) => {
                      let hasSession = false;
                      for (let i = 0; i < previewAvailability.length; i++) {
                        if (
                          previewAvailability[i].day === day &&
                          previewAvailability[i].timeSlot === slotTime
                        ) {
                          hasSession = true;
                          break;
                        }
                      }

                      if (hasSession) {
                        return (
                          <div
                            key={idx}
                            className="bg-indigo-600 text-white text-[9px] font-black p-3 rounded-xl text-center shadow-md shadow-indigo-100 h-[42px] flex items-center justify-center"
                          >
                            {slotTime}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={idx}
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
      </div>
    </div>
  );
};

export default ProfilePreview;
