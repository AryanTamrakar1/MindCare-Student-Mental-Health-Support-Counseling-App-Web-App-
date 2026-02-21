import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import { Star } from "lucide-react";
import RatingStatsCards from "../components/counselorRatings/RatingStatsCards";
import RatingBreakdown from "../components/counselorRatings/RatingBreakdown";

const QUESTIONS = [
  { key: "professionalism", label: "Professionalism" },
  { key: "clarity", label: "Clarity" },
  { key: "empathy", label: "Empathy" },
  { key: "helpfulness", label: "Helpfulness" },
  { key: "overallSatisfaction", label: "Overall Satisfaction" },
];

function getAverage(averages, key) {
  if (!averages) return 0;
  if (averages[key]) return averages[key];
  return 0;
}

const CounselorRatings = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const ur = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rr = await axios.get("/ratings/my-ratings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(ur.data);
        setData(rr.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <CounselorSidebar user={user} />
        <main className="flex-1 ml-[280px] flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Loading Ratings…
          </p>
        </main>
      </div>
    );
  }

  let hasRatings = false;
  if (data && data.totalRatings && data.totalRatings > 0) {
    hasRatings = true;
  }

  let overall = 0;
  if (data && data.averages && data.averages.overall) {
    overall = data.averages.overall;
  }

  let strongestQ = QUESTIONS[0];
  for (let i = 1; i < QUESTIONS.length; i++) {
    if (
      getAverage(data.averages, QUESTIONS[i].key) >
      getAverage(data.averages, strongestQ.key)
    ) {
      strongestQ = QUESTIONS[i];
    }
  }
  const strongestVal = getAverage(data.averages, strongestQ.key);

  let weakestQ = QUESTIONS[0];
  for (let i = 1; i < QUESTIONS.length; i++) {
    if (
      getAverage(data.averages, QUESTIONS[i].key) <
      getAverage(data.averages, weakestQ.key)
    ) {
      weakestQ = QUESTIONS[i];
    }
  }
  const weakVal = getAverage(data.averages, weakestQ.key);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CounselorSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 pb-6 border-b-2 border-slate-300 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Session Ratings
            </h2>
            <p className="text-gray-500 mt-0.5">
              See how students have rated your counseling sessions.
            </p>
          </div>
          <Navbar />
        </div>

        {!hasRatings && (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 py-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 border border-yellow-100">
              <Star size={28} className="text-yellow-400 fill-yellow-300" />
            </div>
            <p className="font-black text-gray-600 text-lg mb-2">
              No Ratings Yet
            </p>
            <p className="text-sm text-gray-400 max-w-xs">
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

export default CounselorRatings;
