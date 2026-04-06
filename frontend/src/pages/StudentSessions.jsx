import React from "react";
import { Calendar, FileText } from "lucide-react";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import SessionCalendar from "../components/studentSessions/SessionCalendar";
import DayPanel from "../components/studentSessions/DayPanel";
import DetailModal from "../components/studentSessions/DetailModal";
import SummaryModal from "../components/studentSessions/SummaryModal";
import SessionCard from "../components/studentSessions/SessionCard";
import SummaryCard from "../components/studentSessions/SummaryCard";
import RatingModal from "../components/studentSessions/RatingModal";
import { StudentSessionsProvider } from "../context/studentSessions/StudentSessionsContext";
import { useStudentSessions } from "../hooks/studentSessions/useStudentSessions";

const StudentSessionsInner = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    selectedSession,
    setSelectedSession,
    summarySession,
    setSummarySession,
    ratingSession,
    setRatingSession,
    dayData,
    setDayData,
    filtered,
    statCards,
    tabs,
  } = useStudentSessions();

  if (!user) {
    return null;
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#EFF6FF] flex">
      <Navbar />
      <StudentSidebar user={user} />
      <main
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{
          paddingTop: "calc(72px + 2.5rem)",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-[#DBEAFE] px-5 py-4 flex items-center gap-4"
            >
              <div className={`w-11 h-11 ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[26px] font-bold text-[#111827] leading-none">{card.count}</p>
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mt-1">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <SessionCalendar />

        {dayData && (
          <DayPanel />
        )}

        <div className="mt-8">
          <div className="bg-white border border-[#DBEAFE] overflow-hidden mb-5">
            <div className="px-8 pt-6 pb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[19px] font-bold text-[#111827]">All Sessions</p>
                <p className="text-[14px] text-[#6B7280] mt-1">View all your upcoming and past sessions.</p>
              </div>
              <div className="flex flex-wrap bg-[#F8FAFC] border border-[#E2E8F0] p-1 gap-0.5">
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
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-[#E2E8F0] text-[#6B7280]"
                        }`}>
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
              {activeTab === "Summary" ? (
                filtered.length > 0 ? (
                  filtered.map((s) => (
                    <SummaryCard key={s._id} session={s} />
                  ))
                ) : (
                  <div className="border border-dashed border-[#DBEAFE] py-14 flex flex-col items-center text-center">
                    <div className="w-11 h-11 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center mb-3">
                      <FileText size={20} className="text-[#2563EB]" strokeWidth={1.8} />
                    </div>
                    <p className="text-[14px] font-semibold text-[#374151] mb-1">No Summaries Yet</p>
                    <p className="text-[13px] text-[#6B7280] max-w-xs">The Session Summary will appear after your counselor writes them.</p>
                  </div>
                )
              ) : filtered.length > 0 ? (
                filtered.map((s) =>
                  s.status === "Completed" ? (
                    <SummaryCard key={s._id} session={s} />
                  ) : (
                    <SessionCard key={s._id} session={s} />
                  )
                )
              ) : (
                <div className="border border-dashed border-[#DBEAFE] py-14 flex flex-col items-center text-center">
                  <div className="w-11 h-11 bg-blue-50 border border-[#DBEAFE] flex items-center justify-center mb-3">
                    <Calendar size={20} className="text-[#2563EB]" strokeWidth={1.8} />
                  </div>
                  <p className="text-[14px] font-semibold text-[#374151] mb-1">No {activeTab} Sessions</p>
                  <p className="text-[13px] text-[#6B7280] max-w-xs">
                    {activeTab === "Upcoming"
                      ? "Visit the counselor directory to book a session!"
                      : activeTab === "Missed"
                        ? "No missed sessions. Keep it up!"
                        : `No ${activeTab.toLowerCase()} sessions yet.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedSession && (
        <DetailModal />
      )}
      {summarySession && (
        <SummaryModal />
      )}
      {ratingSession && (
        <RatingModal />
      )}
    </div>
  );
};

const StudentSessions = () => {
  return (
    <StudentSessionsProvider>
      <StudentSessionsInner />
    </StudentSessionsProvider>
  );
};

export default StudentSessions;