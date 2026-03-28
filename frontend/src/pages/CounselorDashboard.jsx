import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import PendingCountCard from "../components/counselorDashboard/PendingCountCard";
import AverageRatingCard from "../components/counselorDashboard/AverageRatingCard";
import CounselorNextSessionCard from "../components/counselorDashboard/CounselorNextSessionCard";
import SessionCompletionChart from "../components/counselorDashboard/SessionCompletionChart";
import RecentActivityCard from "../components/counselorDashboard/RecentActivityCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CounselorDashboardProvider } from "../context/counselorDashboard/CounselorDashboardContext";
import { useCounselorDashboard } from "../hooks/counselorDashboard/useCounselorDashboard";
import { useNavigate } from "react-router-dom";

const CounselorDashboardInner = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { selectedYear, prevYear, nextYear } = useCounselorDashboard();

  if (!user) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF] flex"
    >
      <CounselorSidebar user={user} />
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
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-6">
            <PendingCountCard />
            <AverageRatingCard />
            <CounselorNextSessionCard />
          </div>

          <div className="bg-white border border-[#DBEAFE]">
            <div className="px-6 py-5 border-b border-[#DBEAFE] flex items-center justify-between">
              <div>
                <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">
                  Session Completion Rate
                </p>
                <p className="text-[13px] text-[#94A3B8] mt-0.5">
                  Sessions completed and new student registrations
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#1D4ED8] inline-block" />
                  <span className="text-[12px] font-semibold text-[#9CA3AF]">
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevYear}
                    className="w-7 h-7 flex items-center justify-center border border-[#DBEAFE] bg-[#F8FAFF] hover:bg-[#EFF6FF] text-[#2563EB] transition-colors"
                  >
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>
                  <span className="text-[14px] font-bold text-[#0F172A] min-w-[88px] text-center">
                    {selectedYear}
                  </span>
                  <button
                    onClick={nextYear}
                    className="w-7 h-7 flex items-center justify-center border border-[#DBEAFE] bg-[#F8FAFF] hover:bg-[#EFF6FF] text-[#2563EB] transition-colors"
                  >
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div style={{ width: "100%", height: "210px" }}>
                <SessionCompletionChart selectedYear={selectedYear} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DBEAFE]">
            <div className="px-6 py-5 border-b border-[#DBEAFE] flex items-center justify-between">
              <div>
                <p className="text-[17px] font-bold text-[#0F172A] tracking-tight">
                  Recent Community Activity
                </p>
                <p className="text-[13px] text-[#94A3B8] mt-0.5">
                  Latest posts and discussions from students
                </p>
              </div>
              <button
                onClick={() => navigate("/community-forum")}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0"
              >
                View all posts
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6">
              <RecentActivityCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const CounselorDashboard = () => {
  return (
    <CounselorDashboardProvider>
      <CounselorDashboardInner />
    </CounselorDashboardProvider>
  );
};

export default CounselorDashboard;
