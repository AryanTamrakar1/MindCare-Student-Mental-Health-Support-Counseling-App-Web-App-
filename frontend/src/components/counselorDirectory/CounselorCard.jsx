import { Star, Users } from "lucide-react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const VISIBLE_TAG_COUNT = 3;

const CounselorCard = ({
  cslr,
  stats,
  liveStatuses,
  expandedCards,
  onToggleCardTags,
  onViewProfile,
}) => {
  const getStatusStyle = (id) => {
    const info = liveStatuses[id];
    if (!info || info.status === "Green")
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (info.status === "Yellow")
      return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  const getStatusLabel = (id) =>
    liveStatuses[id] ? liveStatuses[id].label : "Available";

  const allTags = cslr.specialization
    ? cslr.specialization
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const isExpanded = expandedCards[cslr._id] || false;
  const visibleTags = isExpanded
    ? allTags
    : allTags.slice(0, VISIBLE_TAG_COUNT);
  const hiddenCount = allTags.length - VISIBLE_TAG_COUNT;
  const availableDays = cslr.availability
    ? cslr.availability.map((s) => s.day)
    : [];

  return (
    <div className="bg-white rounded-[24px] p-7 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center flex-shrink-0 border border-indigo-100 overflow-hidden bg-indigo-50">
              {cslr.verificationPhoto ? (
                <img
                  src={`http://127.0.0.1:5050/uploads/verifications/${cslr.verificationPhoto}`}
                  alt={cslr.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<span class="text-indigo-600 font-bold text-2xl">${cslr.name?.charAt(0) || "C"}</span>`;
                  }}
                />
              ) : (
                <span className="text-indigo-600 font-bold text-2xl">
                  {cslr.name?.charAt(0) || "C"}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {cslr.name}
              </h3>
              <p className="text-sm font-medium text-gray-400">
                {cslr.profTitle || "Clinical Counselor"}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border ${getStatusStyle(cslr._id)}`}
          >
            ● {getStatusLabel(cslr._id)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.length > 0 ? (
            <>
              {visibleTags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-50 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-tight"
                >
                  {tag}
                </span>
              ))}
              {!isExpanded && hiddenCount > 0 && (
                <button
                  onClick={() => onToggleCardTags(cslr._id)}
                  className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-tight hover:bg-indigo-100"
                >
                  +{hiddenCount} more
                </button>
              )}
              {isExpanded && (
                <button
                  onClick={() => onToggleCardTags(cslr._id)}
                  className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-tight hover:bg-gray-200"
                >
                  Show less
                </button>
              )}
            </>
          ) : (
            <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-100">
              GENERAL
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 border-y border-gray-100 py-5 mb-6">
          <div className="flex flex-col items-center justify-center border-r border-gray-100 gap-1">
            <div className="flex items-center gap-1.5">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-black text-gray-800">
                {stats.overall > 0 ? stats.overall.toFixed(1) : "0.0"}
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Rating
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-1.5">
              <Users size={18} className="text-indigo-400" />
              <span className="text-xl font-black text-gray-800">
                {stats.studentsHelped}
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
              Students Helped
            </span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Weekly Availability
          </p>
          <div className="flex justify-between gap-1">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`flex-1 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                  availableDays.includes(day)
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-300 border border-gray-100"
                }`}
              >
                {day.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewProfile(cslr._id)}
        className="w-full py-4 bg-white border border-gray-200 rounded-[18px] font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
      >
        View Profile
      </button>
    </div>
  );
};

export default CounselorCard;
