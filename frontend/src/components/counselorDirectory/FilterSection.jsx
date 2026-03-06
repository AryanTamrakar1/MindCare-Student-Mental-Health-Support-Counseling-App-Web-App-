import { useRef } from "react";

const FilterSection = ({
  availableTags,
  selectedSpecialties,
  onToggleTag,
  onApplyFilter,
  onClear,
}) => {
  const scrollRef = useRef(null);
  const hasSelection = !selectedSpecialties.includes("All");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 mb-6">
      <div className="flex items-center gap-3">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {availableTags.map((spec) => {
            const isSelected = selectedSpecialties.includes(spec);
            return (
              <button
                key={spec}
                onClick={() => onToggleTag(spec)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {hasSelection && (
          <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-gray-200">
            <button
              onClick={onClear}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-500 hover:border-gray-300 transition whitespace-nowrap"
            >
              Clear
            </button>
            <button
              onClick={onApplyFilter}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition whitespace-nowrap"
            >
              Apply Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FilterSection;