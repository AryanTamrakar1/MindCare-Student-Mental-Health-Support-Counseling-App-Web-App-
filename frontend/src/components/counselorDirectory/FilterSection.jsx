import { useState, useRef, useEffect } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const FilterSection = ({
  availableTags,
  filterRating, filterStudents, filterAvailability, filterSpecialty, filterStatus,
  onApply, onClear,
}) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState({
    rating: filterRating,
    students: filterStudents,
    availability: filterAvailability,
    specialty: filterSpecialty,
    status: filterStatus,
  });
  const ref = useRef(null);

  useEffect(() => {
    setPending({ rating: filterRating, students: filterStudents, availability: filterAvailability, specialty: filterSpecialty, status: filterStatus });
  }, [filterRating, filterStudents, filterAvailability, filterSpecialty, filterStatus]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = [
    filterRating !== "All Rating", filterStudents !== "All Students",
    filterAvailability !== "Any", filterSpecialty !== "Any", filterStatus !== "Any",
  ].filter(Boolean).length;

  const set = (key, val) => setPending((p) => ({ ...p, [key]: val }));

  const handleApply = () => { onApply(pending); setOpen(false); };
  const handleClear = () => {
    const reset = { rating: "All Rating", students: "All Students", availability: "Any", specialty: "Any", status: "Any" };
    setPending(reset);
    onClear();
  };

  const selectStyle = {
    width: "100%", height: "40px",
    padding: "0 32px 0 12px",
    border: "1px solid #E5E7EB", background: "#FAFAFA",
    fontSize: "14px", color: "#111827", outline: "none",
    cursor: "pointer", appearance: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const labelStyle = {
    display: "block", fontSize: "12px",
    color: "#9CA3AF", marginBottom: "6px",
  };

  return (
    <div style={{ position: "relative", flexShrink: 0 }} ref={ref}>

      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          height: "48px", padding: "0 20px",
          border: open || activeCount > 0 ? "1px solid #2563EB" : "1px solid #E5E7EB",
          color: open || activeCount > 0 ? "#2563EB" : "#374151",
          background: open || activeCount > 0 ? "#EFF6FF" : "#fff",
          fontSize: "14px", fontWeight: "500", cursor: "pointer",
          transition: "all 0.15s",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Filters
        {activeCount > 0 && (
          <span style={{
            width: "20px", height: "20px", background: "#2563EB", color: "#fff",
            fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
          }}>
            {activeCount}
          </span>
        )}
        <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            zIndex: 50, background: "#fff",
            border: "1px solid #E5E7EB",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            padding: "20px", width: "520px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

            <div>
              <label style={labelStyle}>Rating</label>
              <div style={{ position: "relative" }}>
                <select value={pending.rating} onChange={(e) => set("rating", e.target.value)} style={selectStyle}>
                  <option value="All Rating">All Rating</option>
                  <option value="5.0">5.0</option>
                  <option value="4.0+">4.0+ (4.0 - 4.9)</option>
                  <option value="3.0+">3.0+ (3.0 - 3.9)</option>
                  <option value="2.0+">2.0+ (2.0 - 2.9)</option>
                  <option value="1.0+">1.0+ (1.0 - 1.9)</option>
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "10px", pointerEvents: "none" }}>▼</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Students helped</label>
              <div style={{ position: "relative" }}>
                <select value={pending.students} onChange={(e) => set("students", e.target.value)} style={selectStyle}>
                  <option value="All Students">All Students</option>
                  <option value="5+">5+ Students</option>
                  <option value="10+">10+ Students</option>
                  <option value="15+">15+ Students</option>
                  <option value="20+">20+ Students</option>
                  <option value="25+">25+ Students</option>
                  <option value="30+">30+ Students</option>
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "10px", pointerEvents: "none" }}>▼</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Available day</label>
              <div style={{ position: "relative" }}>
                <select value={pending.availability} onChange={(e) => set("availability", e.target.value)} style={selectStyle}>
                  <option value="Any">Any day</option>
                  {daysOfWeek.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "10px", pointerEvents: "none" }}>▼</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Current status</label>
              <div style={{ position: "relative" }}>
                <select value={pending.status} onChange={(e) => set("status", e.target.value)} style={selectStyle}>
                  <option value="Any">Any status</option>
                  <option value="Available">Available now</option>
                  <option value="Booked">Booked</option>
                  <option value="Busy">Busy</option>
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "10px", pointerEvents: "none" }}>▼</span>
              </div>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Specialty</label>
              <div style={{ position: "relative" }}>
                <select value={pending.specialty} onChange={(e) => set("specialty", e.target.value)} style={selectStyle}>
                  <option value="Any">Any specialty</option>
                  {availableTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "10px", pointerEvents: "none" }}>▼</span>
              </div>
            </div>

          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #F3F4F6" }}>
            <button
              onClick={handleApply}
              style={{
                padding: "10px 24px", fontSize: "14px", fontWeight: "600",
                color: "#fff", background: "#2563EB",
                border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "10px 20px", fontSize: "14px",
                color: "#6B7280", background: "#F3F4F6",
                border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E5E7EB"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F3F4F6"; }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;