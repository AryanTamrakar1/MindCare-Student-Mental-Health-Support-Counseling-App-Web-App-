import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import SmartCounselorCard from "../components/recommendations/SmartCounselorCard";
import MoodScoreCard from "../components/studentDashboard/MoodScoreCard";
import MoodTrendCard from "../components/studentDashboard/MoodTrendCard";
import { StudentDashboardProvider } from "../context/studentDashboard/StudentDashboardContext";
import { MoodTrendProvider } from "../context/studentDashboard/MoodTrendContext";
import { MoodScoreProvider } from "../context/studentDashboard/MoodScoreContext";
import { useStudentDashboard } from "../hooks/studentDashboard/useStudentDashboard";
import { ArrowRight, Award } from "lucide-react";

const StudentDashboardInner = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    gamification,
    getProgressPercent,
    getLevelColor,
    getProgressLabel,
    getPointsDisplay,
    getLevelDisplay,
    getBadges,
  } = useStudentDashboard();

  const progressPercent = getProgressPercent();
  const badges = getBadges();

  if (!user) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF] flex"
    >
      <StudentSidebar user={user} />
      <Navbar />

      <main
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{
          paddingTop: "calc(72px + 2.5rem)",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
      >
        <section
          className={
            "bg-gradient-to-br " +
            getLevelColor() +
            " p-8 mb-6 text-white border border-white/10"
          }
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Award size={20} strokeWidth={2} className="opacity-80" />
              <h3 className="text-[17px] font-semibold tracking-wide">
                Your Progression
              </h3>
            </div>
            <span className="bg-white/15 border border-white/20 px-4 py-1.5 text-[13px] font-semibold tracking-wider uppercase">
              {getLevelDisplay()}
            </span>
          </div>

          <div className="flex items-center gap-12">
            <div className="flex flex-col items-center justify-center border border-white/25 w-32 h-32 shrink-0">
              <span className="text-[32px] font-bold leading-none">
                {getPointsDisplay()}
              </span>
              <span className="text-[12px] uppercase tracking-widest opacity-70 mt-1.5">
                Points
              </span>
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-[14px] font-medium mb-2.5 opacity-90">
                <span>{getProgressLabel()}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="bg-white/15 h-2 overflow-hidden mb-5">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: progressPercent + "%" }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {badges.length > 0 &&
                    badges.map(function (badge) {
                      return (
                        <span
                          key={badge.name}
                          className="bg-white/15 border border-white/20 px-3.5 py-1 text-[13px] font-semibold"
                        >
                          {badge.name}
                        </span>
                      );
                    })}
                  {badges.length === 0 && (
                    <span className="bg-white/10 border border-white/15 px-3.5 py-1 text-[13px] font-medium opacity-60">
                      No badges yet
                    </span>
                  )}
                </div>
                <button
                  onClick={function () {
                    navigate("/student/gamification");
                  }}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 transition-all duration-150 px-5 py-2 text-[13px] font-semibold tracking-wide shrink-0"
                >
                  View Progress
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <MoodTrendCard />

            <section className="bg-white border border-[#DBEAFE]">
              <div className="px-6 py-5 border-b border-[#DBEAFE]">
                <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">
                  Recommended Counselors
                </p>
                <p className="text-[13px] text-[#94A3B8] mt-0.5">
                  Counselors matched to your current mood and needs
                </p>
              </div>
              <div className="p-6">
                <SmartCounselorCard />
              </div>
            </section>
          </div>

          <div className="w-full xl:w-[360px] shrink-0">
            <MoodScoreCard />
          </div>
        </div>
      </main>
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <StudentDashboardProvider>
      <MoodTrendProvider>
        <MoodScoreProvider>
          <StudentDashboardInner />
        </MoodScoreProvider>
      </MoodTrendProvider>
    </StudentDashboardProvider>
  );
};

export default StudentDashboard;