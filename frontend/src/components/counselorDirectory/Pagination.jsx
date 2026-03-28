const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  let prevOpacity = 1;
  if (currentPage === 1) prevOpacity = 0.4;

  let nextOpacity = 1;
  if (currentPage === totalPages) nextOpacity = 0.4;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "28px", paddingBottom: "16px" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "8px 16px", fontSize: "14px",
          color: "#374151", background: "#fff",
          border: "1px solid #E5E7EB", cursor: "pointer",
          transition: "all 0.15s", opacity: prevOpacity,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={(e) => { if (currentPage !== 1) { e.currentTarget.style.borderColor = "#DBEAFE"; e.currentTarget.style.color = "#2563EB"; } }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}
      >
        Prev
      </button>

      {pageNumbers.map((num) => {
        let btnBg = "#fff";
        let btnColor = "#374151";
        let btnBorder = "1px solid #E5E7EB";
        if (currentPage === num) {
          btnBg = "#2563EB";
          btnColor = "#fff";
          btnBorder = "1px solid #2563EB";
        }
        return (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            style={{
              width: "36px", height: "36px", fontSize: "14px", fontWeight: "500",
              background: btnBg,
              color: btnColor,
              border: btnBorder,
              cursor: "pointer", transition: "all 0.15s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {num}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 16px", fontSize: "14px",
          color: "#374151", background: "#fff",
          border: "1px solid #E5E7EB", cursor: "pointer",
          transition: "all 0.15s", opacity: nextOpacity,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={(e) => { if (currentPage !== totalPages) { e.currentTarget.style.borderColor = "#DBEAFE"; e.currentTarget.style.color = "#2563EB"; } }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;