import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import CounselorSidebar from "../components/CounselorSidebar";
import Navbar from "../components/Navbar";
import { Star, Users, TrendingUp, Award } from "lucide-react";

const QUESTIONS = [
  {
    key: "professionalism",
    label: "Professionalism",
    description: "How professional was the counselor?",
    color: "bg-indigo-500",
    light: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    key: "clarity",
    label: "Clarity",
    description: "How clearly did the counselor communicate?",
    color: "bg-purple-500",
    light: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    key: "empathy",
    label: "Empathy",
    description: "How empathetic did the counselor feel?",
    color: "bg-pink-500",
    light: "bg-pink-50 text-pink-700 border-pink-100",
  },
  {
    key: "helpfulness",
    label: "Helpfulness",
    description: "How helpful was the session for the student?",
    color: "bg-emerald-500",
    light: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    key: "overallSatisfaction",
    label: "Overall Satisfaction",
    description: "Overall satisfaction with the session.",
    color: "bg-yellow-500",
    light: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
];

const StarDisplay = ({ value, size = 18 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.round(value)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ))}
  </div>
);

const ProgressBar = ({ value, colorClass }) => (
  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
      style={{ width: `${(value / 5) * 100}%` }}
    />
  </div>
);

const CounselorRatings = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const [ur, rr] = await Promise.all([
          axios.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/ratings/my-ratings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
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

  if (loading)
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

  const hasRatings = data?.totalRatings > 0;
  const overall = data?.averages?.overall || 0;

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
            <div className="grid grid-cols-3 gap-5 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 col-span-1">
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-yellow-100">
                  <Star size={28} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Overall Rating
                  </p>
                  <p className="text-4xl font-black text-gray-800 leading-none">
                    {overall.toFixed(1)}
                    <span className="text-lg text-gray-400 font-bold"> /5</span>
                  </p>
                  <div className="mt-2">
                    <StarDisplay value={overall} size={16} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100">
                  <Users size={26} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Total Ratings
                  </p>
                  <p className="text-4xl font-black text-gray-800 leading-none">
                    {data.totalRatings}
                  </p>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    from students
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
                  <Award size={26} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Strongest Area
                  </p>
                  <p className="text-base font-black text-gray-800 leading-tight">
                    {
                      QUESTIONS.reduce((best, q) =>
                        (data.averages[q.key] || 0) >
                        (data.averages[best.key] || 0)
                          ? q
                          : best,
                      ).label
                    }
                  </p>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {Math.max(
                      ...QUESTIONS.map((q) => data.averages[q.key] || 0),
                    ).toFixed(2)}{" "}
                    / 5
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="px-7 py-5 border-b border-gray-100 flex items-center gap-3">
                <TrendingUp size={18} className="text-indigo-500" />
                <h3 className="text-base font-black text-gray-800">
                  Breakdown by Question
                </h3>
              </div>

              <div className="px-7 py-6 flex flex-col gap-6">
                {QUESTIONS.map((q) => {
                  const avg = data.averages[q.key] || 0;
                  return (
                    <div key={q.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${q.light}`}
                          >
                            {q.label}
                          </span>
                          <p className="text-xs text-gray-400 font-medium">
                            {q.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <StarDisplay value={avg} size={14} />
                          <span className="text-sm font-black text-gray-700 w-10 text-right">
                            {avg.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <ProgressBar value={avg} colorClass={q.color} />
                    </div>
                  );
                })}
              </div>
            </div>

            {(() => {
              const weakest = QUESTIONS.reduce((w, q) =>
                (data.averages[q.key] || 0) < (data.averages[w.key] || 0)
                  ? q
                  : w,
              );
              const weakVal = data.averages[weakest.key] || 0;
              if (weakVal >= 4.5) return null;
              return (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-indigo-800 mb-1">
                      Area to Improve: {weakest.label}
                    </p>
                    <p className="text-xs text-indigo-600 font-medium">
                      Your lowest rated area is{" "}
                      <span className="font-black">{weakest.label}</span> at{" "}
                      {weakVal.toFixed(2)}/5. Focus on this area in upcoming
                      sessions to improve your overall rating.
                    </p>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </main>
    </div>
  );
};

export default CounselorRatings;
