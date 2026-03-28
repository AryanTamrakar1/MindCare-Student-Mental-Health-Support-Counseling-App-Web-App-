import { Search, X, SlidersHorizontal } from "lucide-react";

const PostSearchBar = ({ searchTerm, setSearchTerm, onClear, isFiltered }) => {
  let showClearButton = false;
  if (searchTerm) {
    showClearButton = true;
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div
        className="flex items-center flex-1 bg-white border border-[#E5E9F2] px-4 py-[13px] gap-2.5 focus-within:border-[#2563EB] transition-colors"
        style={{ borderRadius: 6 }}
      >
        <Search size={15} className="text-[#9CA3AF] flex-shrink-0" strokeWidth={2} />
        <input
          type="text"
          placeholder="Search posts by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-[14px] font-medium text-[#111827] placeholder:text-[#9CA3AF] bg-transparent"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        />
        {showClearButton && (
          <button
            onClick={onClear}
            className="text-[#9CA3AF] hover:text-[#374151] transition-colors flex-shrink-0"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>

      {isFiltered && (
        <div
          className="flex items-center gap-2 px-4 py-[13px] text-[13px] font-semibold bg-[#2563EB] text-white flex-shrink-0"
          style={{ borderRadius: 6 }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filtered
        </div>
      )}
    </div>
  );
};

export default PostSearchBar;