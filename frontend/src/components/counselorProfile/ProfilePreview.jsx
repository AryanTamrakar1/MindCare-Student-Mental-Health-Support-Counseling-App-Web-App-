import { Star, Users, GraduationCap } from "lucide-react";

const timeSlots = [
  "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM",
];

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ProfilePreview = ({
  userInitial,
  userName,
  previewProfTitle,
  previewExperience,
  previewBio,
  previewSpecializations,
  previewEducation,
  previewAvailability,
}) => {
  const bioParagraphs = [];
  if (previewBio) {
    const lines = previewBio.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed) bioParagraphs.push(trimmed);
    }
  }

  let bioContent;
  if (bioParagraphs.length > 0) {
    bioContent = (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {bioParagraphs.map((para, i) => (
          <p key={i} style={{ fontSize: "15px", color: "#374151", lineHeight: 1.7, margin: 0 }}>{para}</p>
        ))}
      </div>
    );
  } else {
    bioContent = (
      <p style={{ fontSize: "15px", color: "#d1d5db", margin: 0 }}>No biography provided.</p>
    );
  }

  return (
    <div className="w-full bg-white border border-[#E5E7EB] overflow-hidden">

      <div className="px-5 py-4 border-b border-[#F3F4F6]">
        <p className="text-[18px] font-semibold text-[#374151]">Student view preview</p>
        <p className="text-[14px] text-[#9CA3AF] mt-0.5">This is how students will see your profile after you save</p>
      </div>

      <div style={{ padding: "28px 32px", borderBottom: "1px solid #f0f0f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "800", color: "#fff",
          }}>
            {userInitial}
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e", lineHeight: 1.3, marginBottom: "4px" }}>
              {userName}
            </h1>
            <p style={{ fontSize: "14px", color: "#8b8fa8", marginBottom: "8px" }}>
              {previewProfTitle || "Professional Counselor"}
            </p>
            <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: "12px", fontWeight: "600", padding: "4px 10px", display: "inline-block" }}>
              Available
            </span>
          </div>
        </div>
        <button
          disabled
          style={{ background: "#2563EB", color: "#fff", padding: "12px 32px", fontSize: "14px", fontWeight: "600", border: "none", opacity: 0.4, cursor: "not-allowed", flexShrink: 0 }}
        >
          Request session
        </button>
      </div>

      <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
        <div className="flex flex-col items-center justify-center" style={{ padding: "28px 16px", borderRight: "1px solid #f0f0f0", gap: "6px" }}>
          <div className="flex items-center" style={{ gap: "8px" }}>
            <GraduationCap size={20} style={{ color: "#8b8fa8" }} />
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e" }}>{previewExperience || 0}+ yrs</span>
          </div>
          <p style={{ fontSize: "12px", color: "#8b8fa8", fontWeight: "500" }}>Experience</p>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ padding: "28px 16px", borderRight: "1px solid #f0f0f0", gap: "6px" }}>
          <div className="flex items-center" style={{ gap: "8px" }}>
            <Users size={20} style={{ color: "#8b8fa8" }} />
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e" }}>0</span>
          </div>
          <p style={{ fontSize: "12px", color: "#8b8fa8", fontWeight: "500" }}>Students helped</p>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ padding: "28px 16px", gap: "6px" }}>
          <div className="flex items-center" style={{ gap: "8px" }}>
            <Star size={20} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e" }}>0.0</span>
          </div>
          <p style={{ fontSize: "12px", color: "#8b8fa8", fontWeight: "500" }}>Rating</p>
        </div>
      </div>

      <div style={{ padding: "32px" }}>

        <div style={{ paddingBottom: "32px" }}>
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderBottom: "none", padding: "10px 16px" }}>
            <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>About</p>
          </div>
          <div style={{ border: "1px solid #e5e7eb", padding: "20px 16px" }}>
            {bioContent}
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1px 1fr",
          marginLeft: "-32px", marginRight: "-32px",
          borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb",
        }}>
          <div style={{ padding: "28px 32px" }}>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderBottom: "none", padding: "10px 16px" }}>
              <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>Specializations</p>
            </div>
            <div style={{ border: "1px solid #e5e7eb", padding: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {previewSpecializations.map((s, i) => (
                <span key={i} style={{ padding: "6px 14px", background: "#EEF2FF", color: "#2563EB", fontSize: "13px", fontWeight: "500", border: "1px solid #C7D7FD" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: "#e5e7eb" }} />

          <div style={{ padding: "28px 32px" }}>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderBottom: "none", padding: "10px 16px" }}>
              <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>Education</p>
            </div>
            <div style={{ border: "1px solid #e5e7eb", padding: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {previewEducation.map((e, i) => (
                <span key={i} style={{ padding: "6px 14px", background: "#f0fdf4", color: "#16a34a", fontSize: "13px", fontWeight: "500", border: "1px solid #bbf7d0" }}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "28px", marginLeft: "-32px", marginRight: "-32px", paddingLeft: "32px", paddingRight: "32px" }}>
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderBottom: "none", padding: "10px 16px" }}>
            <p style={{ fontSize: "15px", color: "#111827", fontWeight: "700", margin: 0 }}>Weekly Consultation Schedule</p>
          </div>
          <div style={{ border: "1px solid #e5e7eb", padding: "20px" }}>
            <div className="grid grid-cols-5" style={{ gap: "12px" }}>
              {daysOrder.map((day) => (
                <div key={day} style={{ border: "1px solid #e5e7eb", overflow: "hidden", background: "#fafafa" }}>
                  <div style={{ padding: "12px 8px", borderBottom: "1px solid #e5e7eb", background: "#fff", textAlign: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {day}
                    </span>
                  </div>
                  <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {timeSlots.map((slotTime, idx) => {
                      let hasSession = false;
                      for (let i = 0; i < previewAvailability.length; i++) {
                        if (previewAvailability[i].day === day && previewAvailability[i].timeSlot === slotTime) {
                          hasSession = true;
                          break;
                        }
                      }
                      if (hasSession) {
                        return (
                          <div key={idx} style={{ background: "#2563EB", color: "#fff", fontSize: "11px", fontWeight: "600", padding: "9px 6px", textAlign: "center", lineHeight: 1.4 }}>
                            {slotTime}
                          </div>
                        );
                      }
                      return (
                        <div key={idx} style={{ background: "#fff", color: "#d1d5db", fontSize: "11px", padding: "9px 6px", textAlign: "center", border: "1px dashed #e5e7eb" }}>
                          —
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePreview;