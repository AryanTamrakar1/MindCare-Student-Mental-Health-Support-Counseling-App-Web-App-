import { Star, Users, Clock } from "lucide-react";

const VISIBLE_TAG_COUNT = 3;

const avatarColors = [
  "linear-gradient(135deg, #f97316, #ef4444)",
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #0ea5e9, #22c55e)",
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #14b8a6, #0ea5e9)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
];

const DAY_KEYS = [
  { key: "Monday",    label: "M" },
  { key: "Tuesday",   label: "T" },
  { key: "Wednesday", label: "W" },
  { key: "Thursday",  label: "T" },
  { key: "Friday",    label: "F" },
];

const CounselorCard = ({ cslr, stats, liveStatuses, expandedCards, onToggleCardTags, onViewProfile }) => {
  const statusInfo = liveStatuses[cslr._id];

  let statusLabel = "Available";
  let statusBg = "#dcfce7";
  let statusColor = "#16a34a";

  if (statusInfo && statusInfo.status === "Yellow") {
    statusLabel = statusInfo.label;
    statusBg = "#fef9c3";
    statusColor = "#ca8a04";
  } else if (statusInfo && statusInfo.status === "Red") {
    statusLabel = statusInfo.label;
    statusBg = "#fee2e2";
    statusColor = "#dc2626";
  } else if (statusInfo) {
    statusLabel = statusInfo.label;
  }

  let allTags = [];
  if (cslr.specialization) {
    const raw = cslr.specialization.split(",");
    for (let i = 0; i < raw.length; i++) {
      const t = raw[i].trim();
      if (t) allTags.push(t);
    }
  }

  const availableDays = [];
  if (cslr.availability) {
    for (let i = 0; i < cslr.availability.length; i++) {
      const d = cslr.availability[i].day;
      if (!availableDays.includes(d)) availableDays.push(d);
    }
  }

  const isExpanded = expandedCards[cslr._id] || false;
  const hiddenCount = allTags.length - VISIBLE_TAG_COUNT;

  let ratingValue = "—";
  if (stats.overall > 0) ratingValue = stats.overall.toFixed(1);

  let initials = "C";
  if (cslr.name) {
    const parts = cslr.name.split(" ");
    let ini = "";
    for (let i = 0; i < parts.length && i < 2; i++) {
      if (parts[i][0]) ini += parts[i][0].toUpperCase();
    }
    initials = ini;
  }

  const colorIndex = cslr.name ? cslr.name.charCodeAt(0) % avatarColors.length : 0;

  let experienceText = "—";
  if (cslr.experience) experienceText = cslr.experience + " yrs";

  const renderAvatar = () => {
  if (cslr.verificationPhoto) {
    return (
      <img
        src={cslr.verificationPhoto}
        alt={cslr.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: avatarColors[colorIndex],
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px",
      }}
    >
      {initials}
    </div>
  );
};

  const tagStyle = {
    padding: "5px 12px",
    background: "#EEF2FF", color: "#2563EB",
    fontSize: "12px", fontWeight: "500",
    border: "1px solid #C7D7FD",
    whiteSpace: "nowrap",
  };

  const renderTags = () => {
    if (allTags.length === 0) {
      return <span style={tagStyle}>General</span>;
    }

    if (isExpanded) {
      const items = [];
      for (let i = 0; i < allTags.length; i++) {
        items.push(<span key={i} style={tagStyle}>{allTags[i]}</span>);
      }
      items.push(
        <button key="less" onClick={() => onToggleCardTags(cslr._id)}
          style={{ ...tagStyle, cursor: "pointer", background: "#f4f5fb", color: "#8b8fa8", border: "1px solid #e4e6f0" }}>
          less
        </button>
      );
      return <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{items}</div>;
    }

    const visible = [];
    const limit = allTags.length < VISIBLE_TAG_COUNT ? allTags.length : VISIBLE_TAG_COUNT;
    for (let i = 0; i < limit; i++) {
      visible.push(
        <span key={i} title={allTags[i]}
          style={{ ...tagStyle, overflow: "hidden", textOverflow: "ellipsis" }}>
          {allTags[i]}
        </span>
      );
    }

    if (hiddenCount > 0) {
      visible.push(
        <button key="more" onClick={() => onToggleCardTags(cslr._id)}
          style={{ ...tagStyle, cursor: "pointer", background: "#f4f5fb", color: "#8b8fa8", border: "1px solid #e4e6f0", flexShrink: 0 }}>
          +{hiddenCount}
        </button>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        {visible}
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ebebeb",
        padding: "20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s",
        boxSizing: "border-box",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"; }}
    >

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ flexShrink: 0, width: "120px", height: "120px", overflow: "hidden", borderRadius: "50%" }}>
          {renderAvatar()}
        </div>

        <div style={{ flex: 1, minWidth: 0, paddingTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1d2e", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {cslr.name}
            </h3>
            <span style={{
              background: statusBg, color: statusColor,
              fontSize: "12px", fontWeight: "600",
              padding: "4px 10px",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {statusLabel}
            </span>
          </div>

          <p style={{ fontSize: "14px", color: "#8b8fa8", marginBottom: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {cslr.profTitle || "Clinical Counselor"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Star size={14} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "#8b8fa8", flex: 1 }}>Rating</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1d2e" }}>{ratingValue}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Users size={14} style={{ color: "#8b8fa8", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "#8b8fa8", flex: 1 }}>Students helped</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1d2e" }}>{stats.studentsHelped.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Clock size={14} style={{ color: "#8b8fa8", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "#8b8fa8", flex: 1 }}>Experience</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1d2e" }}>{experienceText}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "#f0f0f0", margin: "0 -20px 12px -20px" }} />

      <div style={{ marginBottom: "12px" }}>
        {renderTags()}
      </div>

      <div style={{ height: "1px", background: "#f0f0f0", margin: "0 -20px 12px -20px" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "14px" }}>
        {DAY_KEYS.map(({ key, label }, idx) => {
          const active = availableDays.includes(key);

          let dayBg = "#f4f5fb";
          let dayColor = "#c4c9d4";
          let dayBorder = "1px solid #e4e6f0";
          if (active) {
            dayBg = "#2563EB";
            dayColor = "#fff";
            dayBorder = "1px solid #2563EB";
          }

          return (
            <div key={idx} style={{
              width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: dayBg,
              color: dayColor,
              fontSize: "12px", fontWeight: "700",
              border: dayBorder,
              flexShrink: 0,
            }}>
              {label}
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid #f0f0f0", margin: "auto -20px 0 -20px", padding: "12px 20px 0 20px" }}>
        <button
          onClick={() => onViewProfile(cslr._id)}
          style={{
            width: "100%", padding: "11px",
            background: "#fff", color: "#1a1d2e",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px", fontWeight: "600",
            border: "1.5px solid #dcdde6",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563EB";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#2563EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#1a1d2e";
            e.currentTarget.style.borderColor = "#dcdde6";
          }}
        >
          View profile
        </button>
      </div>
    </div>
  );
};

export default CounselorCard;