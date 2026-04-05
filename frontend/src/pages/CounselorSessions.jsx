import React from "react";
import axios from "../api/axios";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import { Calendar, CheckCircle, Users, Clock } from "lucide-react";
import SessionCalendar from "../components/counselorSessions/SessionCalendar";
import DayPanel from "../components/counselorSessions/DayPanel";
import DetailModal from "../components/counselorSessions/DetailModal";
import SummaryModal from "../components/counselorSessions/SummaryModal";
import SessionCard from "../components/counselorSessions/SessionCard";
import { CounselorSessionsProvider } from "../context/counselorSessions/CounselorSessionsContext";
import { useCounselorSessions } from "../hooks/counselorSessions/useCounselorSessions";

const CounselorSessionsInner = () => {
  const {
    user,
    sessions,
    activeTab,
    setActiveTab,
    selectedSession,
    setSelectedSession,
    summarySession,
    setSummarySession,
    dayData,
    setDayData,
    handleStart,
    handleEnd,
    upcomingCount,
    completedCount,
    missedCount,
    filtered,
    emptyMessage,
    tabs,
  } = useCounselorSessions();

  if (!user) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF] flex"
    >
      <Navbar />
      <CounselorSidebar user={user} />

      <main
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{
          paddingTop: "calc(72px + 2.5rem)",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
      >
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              count: upcomingCount,
              label: "Upcoming",
              icon: Calendar,
              bg: "bg-emerald-50",
              border: "border-emerald-200",
              iconColor: "text-emerald-600",
            },
            {
              count: completedCount,
              label: "Completed",
              icon: CheckCircle,
              bg: "bg-blue-50",
              border: "border-blue-200",
              iconColor: "text-[#2563EB]",
            },
            {
              count: missedCount,
              label: "Missed",
              icon: Clock,
              bg: "bg-orange-50",
              border: "border-orange-200",
              iconColor: "text-orange-500",
            },
            {
              count: sessions.length,
              label: "Total Sessions",
              icon: Users,
              bg: "bg-purple-50",
              border: "border-purple-200",
              iconColor: "text-purple-600",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white border border-[#DBEAFE] px-6 py-5 flex items-center gap-5"
              >
                <div
                  className={`w-12 h-12 ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={20} className={card.iconColor} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[28px] font-bold text-[#111827] leading-none">
                    {card.count}
                  </p>
                  <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-widest mt-1.5">
                    {card.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <SessionCalendar
          sessions={sessions}
          onDateClick={(ds, di) =>
            setDayData(ds ? { sessions: ds, dayInfo: di } : null)
          }
        />

        {dayData && (
          <DayPanel
            daySessions={dayData.sessions}
            dayInfo={dayData.dayInfo}
            onClose={() => setDayData(null)}
            onOpen={setSelectedSession}
          />
        )}

        <div className="mt-6">
          <div className="bg-white border border-[#DBEAFE] overflow-hidden">
            <div className="px-8 pt-6 pb-5 flex items-center justify-between">
              <div>
                <p className="text-[19px] font-bold text-[#111827]">
                  All Sessions
                </p>
                <p className="text-[14px] text-[#6B7280] mt-1">
                  View all your upcoming and past sessions.
                </p>
              </div>
              <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 gap-0.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      className={`px-4 py-2 text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#2563EB] text-white"
                          : "text-[#6B7280] hover:text-[#111827] hover:bg-white"
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#E2E8F0] text-[#6B7280]"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="h-px w-full bg-[#F1F5F9]" />
            <div className="px-8 py-5 flex flex-col gap-3">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <SessionCard
                    key={s._id}
                    session={s}
                    onOpen={setSelectedSession}
                    onWriteSummary={setSummarySession}
                    showSummaryButton={
                      activeTab === "Summary" || activeTab === "Completed"
                    }
                  />
                ))
              ) : (
                <div className="border border-dashed border-[#DBEAFE] py-14 flex flex-col items-center text-center">
                  <div className="w-11 h-11 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center mb-3">
                    <Calendar
                      size={20}
                      className="text-[#2563EB]"
                      strokeWidth={1.8}
                    />
                  </div>
                  <p className="text-[14px] font-semibold text-[#374151] mb-1">
                    No {activeTab} Sessions
                  </p>
                  <p className="text-[13px] text-[#6B7280] max-w-xs">
                    {emptyMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedSession && (
        <DetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onStart={handleStart}
          onEnd={handleEnd}
        />
      )}

      {summarySession && (
        <SummaryModal
          session={summarySession}
          onClose={() => setSummarySession(null)}
          onSaved={(id, text) => {}}
        />
      )}
    </div>
  );
};

const CounselorSessions = () => {
  return (
    <CounselorSessionsProvider>
      <CounselorSessionsInner />
    </CounselorSessionsProvider>
  );
};

export default CounselorSessions;
