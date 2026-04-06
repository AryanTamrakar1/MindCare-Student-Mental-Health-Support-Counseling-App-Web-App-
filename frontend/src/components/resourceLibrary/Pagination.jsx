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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        paddingBottom: "16px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        style={{
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
          background: "#fff",
          border: "1px solid #E5E9F2",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.4 : 1,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
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
              style={{
                width: "60px",
                height: "36px",
                fontSize: "13px",
                fontWeight: "600",
                border: "1px solid #2563EB",
                textAlign: "center",
                outline: "none",
                color: "#374151",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          ) : (
            <button
              key={index}
              onClick={() => setShowInput(true)}
              style={{
                width: "36px",
                height: "36px",
                fontSize: "13px",
                fontWeight: "600",
                background: "#fff",
                color: "#9CA3AF",
                border: "1px solid #E5E9F2",
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              ...
            </button>
          );
        }

        return (
          <button
            key={index}
            onClick={() => onPageChange(item)}
            style={{
              width: "36px",
              height: "36px",
              fontSize: "13px",
              fontWeight: "600",
              background: currentPage === item ? "#2563EB" : "#fff",
              color: currentPage === item ? "#fff" : "#374151",
              border: currentPage === item ? "1px solid #2563EB" : "1px solid #E5E9F2",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {item}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
          background: "#fff",
          border: "1px solid #E5E9F2",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.4 : 1,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;