import { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [showJump, setShowJump] = useState(false);
  const [jumpInput, setJumpInput] = useState("");

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const handleJump = (e) => {
    if (e.key === "Enter") {
      const num = parseInt(jumpInput);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        onPageChange(num);
      }
      setShowJump(false);
      setJumpInput("");
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-2 pb-6 flex-shrink-0">
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

        {pageNumbers.map((item, index) => {
          if (item === "...") {
            return showJump ? (
              <input
                key={index}
                type="number"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onKeyDown={handleJump}
                onBlur={() => { setShowJump(false); setJumpInput(""); }}
                autoFocus
                placeholder="Go to"
                className="w-16 h-9 text-[13px] font-semibold border border-[#2563EB] text-center outline-none text-[#374151]"
              />
            ) : (
              <button
                key={index}
                onClick={() => setShowJump(true)}
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