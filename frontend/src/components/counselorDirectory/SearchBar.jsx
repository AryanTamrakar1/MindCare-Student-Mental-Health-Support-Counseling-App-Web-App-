const SearchBar = ({ searchTerm, setSearchTerm, onSearch, onClear, filterSlot }) => {
  let paddingRight = "16px";
  if (searchTerm) paddingRight = "40px";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(searchTerm)}
          style={{
            width: "100%", height: "48px",
            paddingLeft: "16px", paddingRight: paddingRight,
            border: "1px solid #E5E7EB", background: "#fff",
            fontSize: "15px", color: "#111827", outline: "none",
            boxSizing: "border-box",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        />
        {searchTerm && (
          <button
            onClick={onClear}
            style={{
              position: "absolute", right: "12px", top: 0, bottom: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "none", cursor: "pointer",
              color: "#9CA3AF", fontSize: "20px", lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={() => onSearch(searchTerm)}
        style={{
          height: "48px", padding: "0 24px",
          background: "#2563EB", color: "#fff",
          fontSize: "14px", fontWeight: "600",
          border: "none", cursor: "pointer",
          transition: "background 0.15s", flexShrink: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
      >
        Search
      </button>
      {filterSlot}
    </div>
  );
};

export default SearchBar;