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
    if (!info || info.status === "Green") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (info.status === "Yellow") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-rose-50 text-rose-600 border-rose-100";
  };

  const getStatusLabel = (id) => {
    if (liveStatuses[id]) return liveStatuses[id].label;
    return "Available";
  };

  let allTags = [];
  if (cslr.specialization) {
    allTags = cslr.specialization.split(",").map((t) => t.trim()).filter(Boolean);
  }

  const isExpanded = expandedCards[cslr._id] || false;
  const hiddenCount = allTags.length - VISIBLE_TAG_COUNT;

  let availableDays = [];
  if (cslr.availability) {
    availableDays = cslr.availability.map((s) => s.day);
  }

  const getDayClass = (day) => {
    if (availableDays.includes(day)) return "flex-1 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-all bg-indigo-600 text-white shadow-sm";
    return "flex-1 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-all bg-gray-100 text-gray-300 border border-gray-200";
  };

  const getRatingDisplay = () => {
    if (stats.overall > 0) return stats.overall.toFixed(1);
    return "0.0";
  };

  const getInitial = () => {
    if (cslr.name && cslr.name.charAt(0)) return cslr.name.charAt(0);
    return "C";
  };

  const tagClass = "text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-tight bg-gray-50";

  const renderAvatar = () => {
    if (cslr.verificationPhoto) {
      return (
        <img
          src={`http://127.0.0.1:5050/uploads/verifications/${cslr.verificationPhoto}`}
          alt={cslr.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `<span class="text-indigo-600 font-bold text-2xl">${getInitial()}</span>`;
          }}
        />
      );
    }
    return <span className="text-indigo-600 font-bold text-2xl">{getInitial()}</span>;
  };

  const renderTags = () => {
    if (allTags.length === 0) {
      return <span className={tagClass}>General</span>;
    }

    if (isExpanded) {
      return (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag, i) => (
            <span key={i} className={tagClass}>{tag}</span>
          ))}
          <button
            onClick={() => onToggleCardTags(cslr._id)}
            className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-tight hover:bg-gray-200"
          >
            Show less
          </button>
        </div>
      );
    }

    const firstTag = allTags[0];
    const secondTag = allTags[1];
    const thirdTag = allTags[2];

    return (
      <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
        {firstTag && (
          <span className={tagClass} style={{ whiteSpace: "nowrap", flexShrink: 0 }} title={firstTag}>
            {firstTag}
          </span>
        )}
        {secondTag && (
          <span className={tagClass} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 1, minWidth: 0 }} title={secondTag}>
            {secondTag}
          </span>
        )}
        {thirdTag && (
          <span className={tagClass} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 1, minWidth: 0 }} title={thirdTag}>
            {thirdTag}
          </span>
        )}
        {hiddenCount > 0 && (
          <button
            onClick={() => onToggleCardTags(cslr._id)}
            className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-indigo-200 uppercase tracking-tight hover:bg-indigo-100 whitespace-nowrap flex-shrink-0"
          >
            +{hiddenCount} more
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[24px] p-7 border border-gray-200 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center flex-shrink-0 border border-indigo-100 overflow-hidden bg-indigo-50">
              {renderAvatar()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{cslr.name}</h3>
              <p className="text-sm font-medium text-gray-400">{cslr.profTitle || "Clinical Counselor"}</p>
            </div>
          </div>
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border flex-shrink-0 ${getStatusStyle(cslr._id)}`}>
            ● {getStatusLabel(cslr._id)}
          </span>
        </div>

        <div className="mb-5">
          {renderTags()}
        </div>

        <div className="grid grid-cols-2 border-y-2 border-gray-300 mb-6" style={{ alignItems: "stretch" }}>
          <div className="flex flex-col items-center justify-center border-r-2 border-gray-300 gap-1 py-5">
            <div className="flex items-center gap-1.5">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-black text-gray-900">{getRatingDisplay()}</span>
            </div>
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Rating</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 py-5">
            <div className="flex items-center gap-1.5">
              <Users size={18} className="text-indigo-400" />
              <span className="text-xl font-black text-gray-900">{stats.studentsHelped}</span>
            </div>
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">Students Helped</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-3">Weekly Availability</p>
          <div className="flex justify-between gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className={getDayClass(day)}>
                {day.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewProfile(cslr._id)}
        className="w-full py-4 bg-white border-2 border-gray-200 rounded-[18px] font-black text-xs uppercase tracking-widest text-gray-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
      >
        View Profile
      </button>
    </div>
  );
};

export default CounselorCard;