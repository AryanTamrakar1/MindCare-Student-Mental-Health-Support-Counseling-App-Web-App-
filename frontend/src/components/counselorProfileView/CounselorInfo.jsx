const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const CounselorInfo = ({ counselor, scheduleMap, topics, qualifications }) => {
  if (!counselor) {
    return null;
  }

  const bioParagraphs = [];
  if (counselor.bio) {
    const lines = counselor.bio.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed) bioParagraphs.push(trimmed);
    }
  }

  let bioContent;
  if (counselor.bio) {
    bioContent = (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {bioParagraphs.map((para, i) => (
          <p key={i} style={{ fontSize: "15px", color: "#374151", lineHeight: 1.7, margin: 0, textAlign: "justify" }}>
            {para}
          </p>
        ))}
      </div>
    );
  } else {
    bioContent = (
      <p style={{ fontSize: "15px", color: "#d1d5db", margin: 0 }}>No biography provided.</p>
    );
  }

  return (
    <div style={{ padding: "32px" }}>

      <div style={{ marginBottom: "0", paddingBottom: "32px" }}>
        <div style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderBottom: "none",
          padding: "10px 16px",
        }}>
          <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>
            About
          </p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: "20px 16px" }}>
          {bioContent}
        </div>
      </div>

      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1px 1fr",
          marginLeft: "-32px", marginRight: "-32px",
          borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ padding: "28px 32px" }}>
          <div style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderBottom: "none",
            padding: "10px 16px",
          }}>
            <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>
              Specialization
            </p>
          </div>
          <div style={{ border: "1px solid #e5e7eb", padding: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {topics.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 14px",
                  background: "#EEF2FF", color: "#2563EB",
                  fontSize: "13px", fontWeight: "500",
                  border: "1px solid #C7D7FD",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: "#e5e7eb" }} />

        <div style={{ padding: "28px 32px" }}>
          <div style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderBottom: "none",
            padding: "10px 16px",
          }}>
            <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>
              Education
            </p>
          </div>
          <div style={{ border: "1px solid #e5e7eb", padding: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {qualifications.map((q, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 14px",
                  background: "#f0fdf4", color: "#16a34a",
                  fontSize: "13px", fontWeight: "500",
                  border: "1px solid #bbf7d0",
                }}
              >
                {q}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        paddingTop: "28px",
        marginLeft: "-32px", marginRight: "-32px",
        paddingLeft: "32px", paddingRight: "32px",
      }}>
        <div style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderBottom: "none",
          padding: "10px 16px",
        }}>
          <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>
            Weekly Consultation Schedule
          </p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: "20px" }}>
          <div className="grid grid-cols-5" style={{ gap: "12px" }}>
            {daysOrder.map((day) => (
              <div
                key={day}
                style={{
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                  background: "#fafafa",
                }}
              >
                <div style={{
                  padding: "12px 8px",
                  borderBottom: "1px solid #e5e7eb",
                  background: "#fff", textAlign: "center",
                }}>
                  <span style={{
                    fontSize: "13px", fontWeight: "700",
                    color: "#111827", textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {day}
                  </span>
                </div>
                <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {timeSlots.map((slot, i) => {
                    let hasSession = false;
                    if (scheduleMap[day]) {
                      hasSession = scheduleMap[day].includes(slot);
                    }

                    let slotContent;
                    if (hasSession) {
                      slotContent = (
                        <div
                          key={i}
                          style={{
                            background: "#2563EB", color: "#fff",
                            fontSize: "11px", fontWeight: "600",
                            padding: "9px 6px",
                            textAlign: "center", lineHeight: 1.4,
                          }}
                        >
                          {slot}
                        </div>
                      );
                    } else {
                      slotContent = (
                        <div
                          key={i}
                          style={{
                            background: "#fff", color: "#d1d5db",
                            fontSize: "11px", padding: "9px 6px",
                            textAlign: "center",
                            border: "1px dashed #e5e7eb",
                          }}
                        >
                          —
                        </div>
                      );
                    }
                    return slotContent;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorInfo;