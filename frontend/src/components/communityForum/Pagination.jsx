import { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [showInput, setShowInput] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const handleJump = (e) => {
    if (e.key === "Enter") {
      const num = parseInt(jumpValue);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        onPageChange(num);
      }
      setShowInput(false);
      setJumpValue("");
    }
  };

  return (
    <div className="flex items-center justify-between pt-2 pb-6 flex-shrink-0">
      <p className="text-[13px] font-medium text-[#9CA3AF]">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-[13px] font-semibold text-[#374151] bg-white border border-[#E5E9F2] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>

        {getPages().map((item, index) => {
          if (item === "...") {
            return showInput ? (
              <input
                key={index}
                type="number"
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                onKeyDown={handleJump}
                onBlur={() => { setShowInput(false); setJumpValue(""); }}
                autoFocus
                placeholder="Go to"
                className="w-16 h-9 text-[13px] font-semibold border border-[#2563EB] text-center outline-none text-[#374151]"
              />
            ) : (
              <button
                key={index}
                onClick={() => setShowInput(true)}
                className="w-9 h-9 text-[13px] font-semibold border border-[#E5E9F2] bg-white text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors"
              >
                ...
              </button>
            );
          }
          return (
            <button
              key={index}
              onClick={() => onPageChange(item)}
              className={`w-9 h-9 text-[13px] font-semibold border transition-colors ${
                currentPage === item
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-[#374151] border-[#E5E9F2] hover:bg-[#F3F4F6]"
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-[13px] font-semibold text-[#374151] bg-white border border-[#E5E9F2] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;