import { TrendingUp, MessageCircle, UserCheck, MessageSquare } from "lucide-react";

const CATEGORIES = [
  "Academic & Exam Pressure",
  "Skill Gap & Job Anxiety",
  "Family & Social Pressure",
  "Emotional & Personal Issues",
  "Sleep & Physical Wellbeing",
  "General Mental Health",
];

const MOOD_TAGS = [
  { label: "Overwhelmed", icon: null, color: "#EF4444" },
  { label: "Struggling",  icon: null, color: "#F97316" },
  { label: "Confused",    icon: null, color: "#F59E0B" },
  { label: "Frustrated",  icon: null, color: "#F43F5E" },
  { label: "Hopeful",     icon: null, color: "#10B981" },
];

const Checkbox = ({ checked, onChange, label, icon: Icon, iconColor }) => (
  <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F5F9FF] transition-colors group">
    <div
      onClick={onChange}
      className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
        checked ? "bg-[#2563EB] border-[#2563EB]" : "bg-white border-[#D1D5DB] group-hover:border-[#2563EB]"
      }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <div className="flex items-center gap-2 flex-1">
      {Icon && <Icon size={13} strokeWidth={2} style={{ color: checked ? iconColor : "#9CA3AF", flexShrink: 0 }} />}
      <span className={`text-[13px] leading-snug select-none ${checked ? "font-semibold text-[#111827]" : "font-medium text-[#374151]"}`}>
        {label}
      </span>
    </div>
  </label>
);

const CategoryFilter = ({
  selectedCategories,
  toggleCategory,
  sortBy,
  setSortBy,
  appliedCategories,
  selectedMoods,
  toggleMood,
  filterCounselorReplied,
  setFilterCounselorReplied,
  filterHasReplies,
  setFilterHasReplies,
  onApply,
  onClear,
  isFiltered,
}) => {
  let allCategoriesSelected = false;
  if (selectedCategories.length === 0) {
    allCategoriesSelected = true;
  }

  let allMoodsSelected = false;
  if (selectedMoods.length === 0) {
    allMoodsSelected = true;
  }

  const handleAllCategories = () => {
    if (!allCategoriesSelected) {
      for (let i = 0; i < selectedCategories.length; i++) {
        toggleCategory(selectedCategories[i]);
      }
    }
  };

  const handleAllMoods = () => {
    if (!allMoodsSelected) {
      for (let i = 0; i < selectedMoods.length; i++) {
        toggleMood(selectedMoods[i]);
      }
    }
  };

  return (
    <div
      className="bg-white border border-[#E5E9F2] flex flex-col"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", height: "100%", overflow: "hidden" }}
    >
      <div className="px-5 py-4 border-b border-[#E5E9F2] flex items-center justify-between flex-shrink-0">
        <p className="text-[15px] font-bold text-[#111827]">Filter Posts</p>
        {isFiltered && (
          <span className="text-[11px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5">Active</span>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>

        <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Topic</p>
          <div className="flex flex-col gap-0.5">
            <Checkbox checked={allCategoriesSelected} onChange={handleAllCategories} label="All" />
            {CATEGORIES.map((cat) => (
              <Checkbox key={cat} checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} label={cat} />
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Mood</p>
          <div className="flex flex-col gap-0.5">
            <Checkbox checked={allMoodsSelected} onChange={handleAllMoods} label="All Moods" />
            {MOOD_TAGS.map(({ label, icon, color }) => (
              <Checkbox
                key={label}
                checked={selectedMoods.includes(label)}
                onChange={() => toggleMood(label)}
                label={label}
                icon={icon}
                iconColor={color}
              />
            ))}
          </div>
        </div>

        <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Post Status</p>
          <div className="flex flex-col gap-0.5">
            {(() => {
              let labelBgClass = "hover:bg-[#F5F9FF]";
              if (filterCounselorReplied) {
                labelBgClass = "bg-[#EEF2FF]";
              }

              let divBgClass = "bg-white border-[#D1D5DB] group-hover:border-[#2563EB]";
              if (filterCounselorReplied) {
                divBgClass = "bg-[#2563EB] border-[#2563EB]";
              }

              let iconColor = "text-[#9CA3AF]";
              if (filterCounselorReplied) {
                iconColor = "text-[#2563EB]";
              }

              let textClass = "font-medium text-[#374151]";
              if (filterCounselorReplied) {
                textClass = "font-semibold text-[#111827]";
              }

              return (
                <label
                  onClick={() => setFilterCounselorReplied(!filterCounselorReplied)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group ${labelBgClass}`}
                >
                  <div className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${divBgClass}`}>
                    {filterCounselorReplied && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <UserCheck size={13} strokeWidth={2} className={iconColor} />
                    <span className={`text-[13px] select-none ${textClass}`}>Counselor Replied</span>
                  </div>
                </label>
              );
            })()}

            {(() => {
              let labelBgClass = "hover:bg-[#F5F9FF]";
              if (filterHasReplies) {
                labelBgClass = "bg-[#EEF2FF]";
              }

              let divBgClass = "bg-white border-[#D1D5DB] group-hover:border-[#2563EB]";
              if (filterHasReplies) {
                divBgClass = "bg-[#2563EB] border-[#2563EB]";
              }

              let iconColor = "text-[#9CA3AF]";
              if (filterHasReplies) {
                iconColor = "text-[#2563EB]";
              }

              let textClass = "font-medium text-[#374151]";
              if (filterHasReplies) {
                textClass = "font-semibold text-[#111827]";
              }

              return (
                <label
                  onClick={() => setFilterHasReplies(!filterHasReplies)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group ${labelBgClass}`}
                >
                  <div className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${divBgClass}`}>
                    {filterHasReplies && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <MessageSquare size={13} strokeWidth={2} className={iconColor} />
                    <span className={`text-[13px] select-none ${textClass}`}>Has Replies</span>
                  </div>
                </label>
              );
            })()}
          </div>
        </div>

        <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
          <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Sort By</p>
          <div className="flex flex-col gap-0.5">
            {[
              { value: "none", label: "Default", icon: null },
              { value: "most-liked", label: "Most Liked", icon: TrendingUp },
              { value: "most-commented", label: "Most Replied", icon: MessageCircle },
            ].map(({ value, label, icon: Icon }) => {
              let labelBgClass = "hover:bg-[#F5F9FF]";
              if (sortBy === value) {
                labelBgClass = "bg-[#EEF2FF]";
              }

              let divBorderClass = "border-[#D1D5DB] group-hover:border-[#2563EB]";
              if (sortBy === value) {
                divBorderClass = "border-[#2563EB]";
              }

              let iconColor = "text-[#9CA3AF]";
              if (sortBy === value) {
                iconColor = "text-[#2563EB]";
              }

              let textClass = "font-medium text-[#374151]";
              if (sortBy === value) {
                textClass = "font-semibold text-[#2563EB]";
              }

              return (
                <label
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group ${labelBgClass}`}
                >
                  <div className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${divBorderClass}`}>
                    {sortBy === value && <div className="w-2 h-2 bg-[#2563EB]" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {Icon && <Icon size={13} strokeWidth={2} className={iconColor} />}
                    <span className={`text-[13px] select-none ${textClass}`}>{label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="px-4 pt-4 pb-4 flex flex-col gap-2.5">
          <button
            onClick={onApply}
            className="w-full py-3 text-[14px] font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Apply Filter
          </button>
          <button
            onClick={onClear}
            className="w-full py-3 text-[14px] font-semibold text-[#374151] bg-white border border-[#E5E9F2] hover:bg-[#F5F9FF] transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;