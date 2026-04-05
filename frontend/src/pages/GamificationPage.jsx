import React from "react";
import { ChevronLeft } from "lucide-react";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import LevelBadge from "../components/gamification/LevelBadge";
import PointsDisplay from "../components/gamification/PointsDisplay";
import BadgeCollection from "../components/gamification/BadgeCollection";
import MilestoneLetters from "../components/gamification/MilestoneLetters";
import RestDayIndicator from "../components/gamification/RestDayIndicator";
import { GamificationProvider } from "../context/gamification/GamificationContext";
import { useGamification } from "../hooks/gamification/useGamification";

const GamificationPageInner = () => {
  const { user, data, navigate, handleRestDayUsed } = useGamification();

  if (!user) {
    return null;
  }

  if (!data) {
    return (
      <div
        className="min-h-screen bg-[#EFF6FF]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <StudentSidebar user={user} />
        <Navbar />
        <main className="ml-[260px] pt-[72px] flex items-center justify-center min-h-screen">
          <p className="text-[#9CA3AF] font-bold text-[14px]">
            No data available
          </p>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#EFF6FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <StudentSidebar user={user} />
      <Navbar />

      <main className="ml-[260px] pt-[72px] overflow-y-auto">
        <div className="px-8 pt-4 pb-2 bg-[#EFF6FF]">
          <button
            onClick={() => navigate("/student-dashboard")}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#2563EB] transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            Back to Dashboard
          </button>
        </div>

        <div className="px-8 pb-8 pt-4">
          <div className="grid grid-cols-1 gap-6 mb-6 items-stretch">
            <div className="flex flex-col">
              <LevelBadge
                level={data.level}
                levelTitle={data.levelTitle}
                points={data.points}
                nextLevelPoints={data.nextLevelPoints}
              />
            </div>
            <div className="flex flex-col">
              <RestDayIndicator
                restDaysUsed={data.restDaysUsed}
                restDaysRemaining={data.restDaysRemaining}
                onRestDayUsed={handleRestDayUsed}
                usedRestDayToday={data.usedRestDayToday}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 items-stretch">
            <div className="flex flex-col">
              <PointsDisplay
                points={data.points}
                currentStreak={data.currentStreak}
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <BadgeCollection badges={data.badges} />
            </div>
          </div>

          <div>
            <MilestoneLetters letters={data.milestoneLetters} />
          </div>
        </div>
      </main>
    </div>
  );
};

const GamificationPage = () => {
  return (
    <GamificationProvider>
      <GamificationPageInner />
    </GamificationProvider>
  );
};

export default GamificationPage;
