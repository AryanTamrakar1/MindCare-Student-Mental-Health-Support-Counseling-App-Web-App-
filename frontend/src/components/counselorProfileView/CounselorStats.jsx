import { Star, Users, GraduationCap } from "lucide-react";

const CounselorStats = ({ counselor, counselorStats }) => {
  if (!counselor) {
    return null;
  }

  let overallDisplay = "0.0";
  if (counselorStats.overall > 0) {
    overallDisplay = counselorStats.overall.toFixed(1);
  }

  let experienceDisplay = "0";
  if (counselor.experience) {
    experienceDisplay = counselor.experience;
  }

  return (
    <div
      className="grid grid-cols-3"
      style={{ borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{ padding: "28px 16px", borderRight: "1px solid #f0f0f0", gap: "6px" }}
      >
        <div className="flex items-center" style={{ gap: "8px" }}>
          <GraduationCap size={20} style={{ color: "#8b8fa8" }} />
          <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e" }}>
            {experienceDisplay}+ yrs
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#8b8fa8", fontWeight: "500" }}>
          Experience
        </p>
      </div>

      <div
        className="flex flex-col items-center justify-center"
        style={{ padding: "28px 16px", borderRight: "1px solid #f0f0f0", gap: "6px" }}
      >
        <div className="flex items-center" style={{ gap: "8px" }}>
          <Users size={20} style={{ color: "#8b8fa8" }} />
          <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e" }}>
            {counselorStats.studentsHelped}
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#8b8fa8", fontWeight: "500" }}>
          Students helped
        </p>
      </div>

      <div
        className="flex flex-col items-center justify-center"
        style={{ padding: "28px 16px", gap: "6px" }}
      >
        <div className="flex items-center" style={{ gap: "8px" }}>
          <Star size={20} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
          <span style={{ fontSize: "22px", fontWeight: "700", color: "#1a1d2e" }}>
            {overallDisplay}
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#8b8fa8", fontWeight: "500" }}>
          Rating
        </p>
      </div>
    </div>
  );
};

export default CounselorStats;