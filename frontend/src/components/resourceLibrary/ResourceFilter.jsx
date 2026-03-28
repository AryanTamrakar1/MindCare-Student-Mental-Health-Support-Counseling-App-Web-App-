import { BookOpen, Bookmark, Search, X, BadgeCheck, SlidersHorizontal } from "lucide-react";
import { useResourceFilter } from "../../hooks/resourceLibrary/useResourceFilter";

const categories = [
  "All",
  "General Mental Health",
  "Exam & Academic Pressure",
  "Skill Gap & Career Fear",
  "Family Expectation Burden",
  "Sleep & Energy",
  "Social Isolation",
  "Low Motivation",
];

const types = ["All", "Video", "Article"];

function ResourceFilter() {
  const {
    searchDraft,
    setSearchDraft,
    handleSearch,
    handleClearSearch,
    activeTab,
    setActiveTab,
    counselorDraft,
    setCounselorDraft,
    typeDraft,
    setTypeDraft,
    categoryDraft,
    setCategoryDraft,
    sortDraft,
    setSortDraft,
    handleApplyFilter,
    handleClearFilter,
  } = useResourceFilter();

  const selectStyle = {
    fontSize: "13px", fontWeight: "500",
    padding: "8px 12px",
    border: "1px solid #E5E9F2", background: "#F9FAFB",
    color: "#374151", outline: "none", cursor: "pointer",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  let showSearchClear = false;
  if (searchDraft !== "") {
    showSearchClear = true;
  }

  const tabBtn = (active, onClick, icon, label, activeStyle) => {
    let borderStyle = "1px solid #E5E9F2";
    if (active) {
      if (activeStyle && activeStyle.border) {
        borderStyle = activeStyle.border;
      } else {
        borderStyle = "1px solid #2563EB";
      }
    }

    let bgStyle = "#F9FAFB";
    if (active) {
      if (activeStyle && activeStyle.bg) {
        bgStyle = activeStyle.bg;
      } else {
        bgStyle = "#2563EB";
      }
    }

    let colorStyle = "#374151";
    if (active) {
      if (activeStyle && activeStyle.color) {
        colorStyle = activeStyle.color;
      } else {
        colorStyle = "#fff";
      }
    }

    return (
      <button
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "12px", fontWeight: "600", padding: "7px 14px",
          border: borderStyle,
          background: bgStyle,
          color: colorStyle,
          cursor: "pointer", transition: "all 0.15s",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        background: "#fff", border: "1px solid #E5E9F2",
        padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          display: "flex", alignItems: "center", flex: 1,
          background: "#F9FAFB", border: "1px solid #E5E9F2",
          padding: "0 14px", gap: "10px",
        }}>
          <Search size={14} strokeWidth={2} style={{ color: "#9CA3AF", flexShrink: 0 }} />
          <input
            type="text"
            value={searchDraft}
            onChange={function (e) { setSearchDraft(e.target.value); }}
            onKeyDown={function (e) { if (e.key === "Enter") handleSearch(); }}
            placeholder="Search resources..."
            style={{
              flex: 1, fontSize: "14px", fontWeight: "500", color: "#111827",
              outline: "none", background: "transparent", border: "none",
              padding: "10px 0",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
          {showSearchClear && (
            <button
              onClick={handleClearSearch}
              style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px", background: "#2563EB", color: "#fff",
            fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
        >
          Search
        </button>
      </div>

      <div style={{ height: "1px", background: "#F1F1F1" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {tabBtn(activeTab === "all", function () { setActiveTab("all"); }, <BookOpen size={13} strokeWidth={2} />, "All Resources")}
        {tabBtn(activeTab === "bookmarked", function () { setActiveTab("bookmarked"); }, <Bookmark size={13} strokeWidth={2} />, "Saved")}
        {tabBtn(
          counselorDraft === true,
          function () { setCounselorDraft(!counselorDraft); },
          <BadgeCheck size={13} strokeWidth={2} />,
          "Counselor Pick",
          { bg: "#16a34a", color: "#fff", border: "1px solid #16a34a" }
        )}

        <div style={{ width: "1px", height: "24px", background: "#E5E9F2" }} />

        <select value={typeDraft} onChange={function (e) { setTypeDraft(e.target.value); }} style={selectStyle}>
          {types.map(function (type) {
            let optionLabel = type;
            if (type === "All") {
              optionLabel = "All Types";
            }
            return <option key={type} value={type}>{optionLabel}</option>;
          })}
        </select>

        <select value={categoryDraft} onChange={function (e) { setCategoryDraft(e.target.value); }} style={selectStyle}>
          {categories.map(function (cat) {
            let optionLabel = cat;
            if (cat === "All") {
              optionLabel = "All Categories";
            }
            return <option key={cat} value={cat}>{optionLabel}</option>;
          })}
        </select>

        <select value={sortDraft} onChange={function (e) { setSortDraft(e.target.value); }} style={selectStyle}>
          <option value="None">Sort By</option>
          <option value="Most Liked">Most Liked</option>
          <option value="Least Liked">Least Liked</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
          <button
            onClick={handleClearFilter}
            style={{
              fontSize: "12px", fontWeight: "600", padding: "7px 14px",
              color: "#374151", background: "#F9FAFB",
              border: "1px solid #E5E9F2", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fef2f2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E9F2"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "#F9FAFB"; }}
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilter}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: "600", padding: "7px 14px",
              background: "#2563EB", color: "#fff",
              border: "none", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
          >
            <SlidersHorizontal size={12} strokeWidth={2} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceFilter;