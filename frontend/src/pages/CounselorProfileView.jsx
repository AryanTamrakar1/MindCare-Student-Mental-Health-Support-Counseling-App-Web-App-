import React from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import CounselorHeader from "../components/CounselorProfileView/CounselorHeader";
import CounselorStats from "../components/CounselorProfileView/CounselorStats";
import CounselorInfo from "../components/CounselorProfileView/CounselorInfo";
import BookingModal from "../components/CounselorProfileView/BookingModal";
import { CounselorProfileViewProvider } from "../context/counselorProfileView/CounselorProfileViewContext";
import { BookingModalProvider } from "../context/counselorProfileView/BookingModalContext";
import { useCounselorProfileView } from "../hooks/counselorProfileView/useCounselorProfileView";

const CounselorProfileViewInner = () => {
  const navigate = useNavigate();
  const {
    user,
    counselor,
    isModalOpen,
    setIsModalOpen,
    liveStatus,
    counselorStats,
    buildScheduleMap,
    getTopics,
    getQualifications,
  } = useCounselorProfileView();

  if (!user) {
    return null;
  }

  const scheduleMap = buildScheduleMap();
  const topics = getTopics();
  const qualifications = getQualifications();

  return (
    <div
      className="min-h-screen bg-[#EFF6FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />
      <StudentSidebar user={user} />

      <main className="ml-[260px] pt-[72px]">
        <div className="px-7 py-7">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none",
              fontSize: "14px", color: "#8b8fa8",
              cursor: "pointer", padding: "0",
              marginBottom: "20px", display: "flex",
              alignItems: "center", gap: "6px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#2563EB"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8b8fa8"; }}
          >
            ← Back to Directory
          </button>

          <div style={{
            background: "#fff",
            border: "1px solid #ebebeb",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <CounselorHeader
              counselor={counselor}
              liveStatus={liveStatus}
              onRequestSession={() => setIsModalOpen(true)}
            />
            <CounselorStats
              counselor={counselor}
              counselorStats={counselorStats}
            />
            <CounselorInfo
              counselor={counselor}
              scheduleMap={scheduleMap}
              topics={topics}
              qualifications={qualifications}
            />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <BookingModalProvider>
          <BookingModal counselor={counselor} topics={topics} />
        </BookingModalProvider>
      )}
    </div>
  );
};

const CounselorProfileView = () => {
  return (
    <CounselorProfileViewProvider>
      <CounselorProfileViewInner />
    </CounselorProfileViewProvider>
  );
};

export default CounselorProfileView;