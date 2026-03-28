import React from "react";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import RequestCard from "../components/pendingRequests/RequestCard";
import { PendingRequestsProvider } from "../context/pendingRequests/PendingRequestsContext";
import { usePendingRequests } from "../hooks/pendingRequests/usePendingRequests";

const PendingRequestsInner = () => {
  const { user, requests, expandedId, setExpandedId, handleAction } =
    usePendingRequests();

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#EFF4FB",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Navbar />
      <CounselorSidebar user={user} />
      <main className="flex-1 ml-[260px] pt-[72px]">
        <div className="p-10">
          <div className="bg-white border border-[#E5E9F2] overflow-hidden">
            <div
              className="grid border-b border-[#E5E9F2] bg-[#F9FAFB]"
              style={{
                gridTemplateColumns: "2.5fr 1px 1.5fr 1px 1.5fr 1px 1.6fr",
              }}
            >
              {[
                { label: "Student", col: true },
                { label: "Date", col: true },
                { label: "Time Slot", col: true },
                { label: "Action", col: false },
              ].map(({ label, col }, i) => (
                <React.Fragment key={`header-${i}`}>
                  <div className="px-8 py-5">
                    <span className="text-[13px] font-bold text-[#6B7280] uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                  {col && <div className="bg-[#E5E9F2]" />}
                </React.Fragment>
              ))}
            </div>

            {requests.length > 0 ? (
              requests.map((req) => (
                <RequestCard
                  key={req._id}
                  req={req}
                  onAction={handleAction}
                  expanded={expandedId === req._id}
                  onToggle={() =>
                    setExpandedId(expandedId === req._id ? null : req._id)
                  }
                />
              ))
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <p className="text-[18px] font-semibold text-[#111827] mb-2">
                  No pending requests
                </p>
                <p className="text-[15px] text-[#9CA3AF] max-w-xs leading-relaxed">
                  You'll be notified here when a student requests a session.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const PendingRequests = () => {
  return (
    <PendingRequestsProvider>
      <PendingRequestsInner />
    </PendingRequestsProvider>
  );
};

export default PendingRequests;