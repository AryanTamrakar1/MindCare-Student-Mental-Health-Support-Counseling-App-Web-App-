import React from "react";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import { Star } from "lucide-react";
import RatingStatsCards from "../components/counselorRatings/RatingStatsCards";
import RatingBreakdown from "../components/counselorRatings/RatingBreakdown";
import { CounselorRatingsProvider } from "../context/counselorRatings/CounselorRatingsContext";
import { usecounselorRatings } from "../hooks/counselorRatings/useCounselorRatings";

const CounselorRatingsInner = () => {
  const {
    user,
    hasRatings,
    overall,
    data,
    strongestQ,
    strongestVal,
    weakestQ,
    weakVal,
  } = usecounselorRatings();

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
        {!hasRatings && (
          <div className="bg-white border border-dashed border-[#DBEAFE] py-24 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-yellow-50 border border-yellow-200 flex items-center justify-center mb-4">
              <Star
                size={22}
                className="text-yellow-400 fill-yellow-300"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-[17px] font-bold text-[#111827] mb-2">
              No Ratings Yet
            </p>
            <p className="text-[14px] text-[#6B7280] max-w-xs">
              Students can rate sessions after they are completed. Ratings will
              appear here once submitted.
            </p>
          </div>
        )}

        {hasRatings && (
          <>
            <RatingStatsCards
              overall={overall}
              totalRatings={data.totalRatings}
              strongestLabel={strongestQ.label}
              strongestVal={strongestVal}
            />
            <RatingBreakdown
              averages={data.averages}
              weakestLabel={weakestQ.label}
              weakVal={weakVal}
            />
          </>
        )}
      </main>
    </div>
  );
};

const CounselorRatings = () => {
  return (
    <CounselorRatingsProvider>
      <CounselorRatingsInner />
    </CounselorRatingsProvider>
  );
};

export default CounselorRatings;