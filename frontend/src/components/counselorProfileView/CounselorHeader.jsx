const CounselorHeader = ({ counselor, liveStatus, onRequestSession }) => {
  if (!counselor) {
    return null;
  }

  const safeStatus = liveStatus || { status: "Green", label: "Available" };

  let statusBg = "#dcfce7";
  let statusColor = "#16a34a";
  let statusLabel = safeStatus.label || "Available";

  if (safeStatus.status === "Yellow") {
    statusBg = "#fef9c3";
    statusColor = "#ca8a04";
  } else if (safeStatus.status === "Red") {
    statusBg = "#fee2e2";
    statusColor = "#dc2626";
  }

  let initial = "C";
  if (counselor.name && counselor.name.length > 0) {
    initial = counselor.name.charAt(0);
  }

  const avatarColors = [
    "linear-gradient(135deg, #f97316, #ef4444)",
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #0ea5e9, #22c55e)",
    "linear-gradient(135deg, #ec4899, #f43f5e)",
    "linear-gradient(135deg, #14b8a6, #0ea5e9)",
    "linear-gradient(135deg, #f59e0b, #f97316)",
  ];

  let colorIndex = 0;
  if (counselor.name) {
    colorIndex = counselor.name.charCodeAt(0) % avatarColors.length;
  }

  let avatarContent = initial;
  if (counselor.verificationPhoto) {
    avatarContent = (
      <img
        src={counselor.verificationPhoto}
        alt={counselor.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }

  return (
    <div
      className="flex justify-between items-center"
      style={{
        padding: "28px 32px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
        gap: "16px",
      }}
    >
      <div className="flex items-center" style={{ gap: "20px" }}>
        <div
          style={{
            width: "80px", height: "80px",
            borderRadius: "50%", flexShrink: 0,
            overflow: "hidden",
            background: avatarColors[colorIndex],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "800", color: "#fff",
          }}
        >
          {avatarContent}
        </div>

        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e", lineHeight: 1.3, marginBottom: "4px" }}>
            {counselor.name}
          </h1>
          <p style={{ fontSize: "14px", color: "#8b8fa8", marginBottom: "8px" }}>
            {counselor.profTitle || "Professional Counselor"}
          </p>
          <span style={{
            background: statusBg, color: statusColor,
            fontSize: "12px", fontWeight: "600",
            padding: "4px 10px",
            display: "inline-block",
          }}>
            {statusLabel}
          </span>
        </div>
      </div>

      <button
        onClick={onRequestSession}
        style={{
          background: "#2563EB", color: "#fff",
          padding: "12px 32px",
          fontSize: "14px", fontWeight: "600",
          border: "none", cursor: "pointer",
          transition: "background 0.15s", flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#1D4ED8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#2563EB"; }}
      >
        Request session
      </button>
    </div>
  );
};

export default CounselorHeader;