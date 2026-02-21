const FilterSection = ({
  availableTags,
  selectedSpecialties,
  onToggleTag,
  onApplyFilter,
  onClear,
}) => {
  return (
    <section className="bg-white p-6 rounded-[15px] border border-gray-200 mb-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Filter by Specialization:
          </p>
          {!selectedSpecialties.includes("All") && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
              {selectedSpecialties.length} Selected
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApplyFilter}
            className="text-[12px] font-bold bg-[#4f46e5] text-white px-5 py-2 rounded-xl hover:bg-[#3730a3] transition shadow-md"
          >
            Apply Filter
          </button>
          <button
            onClick={onClear}
            className="text-[12px] font-bold bg-gray-100 text-gray-500 px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap max-h-40 overflow-y-auto pr-2">
        {availableTags.map((spec) => {
          const isSelected = selectedSpecialties.includes(spec);
          return (
            <button
              key={spec}
              onClick={() => onToggleTag(spec)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400"
              }`}
            >
              {isSelected && <span>✓</span>}
              {spec}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FilterSection;
