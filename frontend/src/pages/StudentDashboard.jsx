import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/Sidebars/StudentSidebar";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Student Dashboard
            </h2>
            <p className="text-gray-500">
              Welcome back! Let's check your mental well-being today.
            </p>
          </div>
          <Navbar />
        </div>

        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 mb-6 text-white shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black">Your Progression</h3>
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              Level 3: Mindful Explorer
            </span>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center justify-center border-4 border-white/30 rounded-full w-32 h-32">
              <span className="text-3xl font-black">1,250</span>
              <span className="text-xs uppercase tracking-wider opacity-80">
                Total Points
              </span>
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Progress to Level 4 (Engaged)</span>
                <span>75%</span>
              </div>
              <div className="bg-white/20 h-3 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-white h-full rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="flex gap-2">
                <span className="bg-white/15 px-3 py-1 rounded-lg text-xs font-bold">
                  🏅 Quiz Streak
                </span>
                <span className="bg-white/15 px-3 py-1 rounded-lg text-xs font-bold">
                  🌟 First Session
                </span>
                <span className="bg-white/15 px-3 py-1 rounded-lg text-xs font-bold">
                  🤝 Helper
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 mb-6 border border-black/10">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            Recommended Counselors
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-indigo-400 flex items-center justify-center text-white font-black text-xl mb-3">
                R
              </div>
              <strong className="text-base font-bold text-gray-900">
                Cslr. Rohan
              </strong>
              <span className="text-xs text-gray-500 font-semibold mb-3">
                Stress Expert
              </span>
              <button className="w-full bg-white border border-gray-200 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-50 transition">
                View Profile
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-pink-400 flex items-center justify-center text-white font-black text-xl mb-3">
                A
              </div>
              <strong className="text-base font-bold text-gray-900">
                Dr. Anjali
              </strong>
              <span className="text-xs text-gray-500 font-semibold mb-3">
                Depression Spec.
              </span>
              <button className="w-full bg-white border border-gray-200 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-50 transition">
                View Profile
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center text-white font-black text-xl mb-3">
                S
              </div>
              <strong className="text-base font-bold text-gray-900">
                Cslr. Sameer
              </strong>
              <span className="text-xs text-gray-500 font-semibold mb-3">
                Career Pressure
              </span>
              <button className="w-full bg-white border border-gray-200 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-50 transition">
                View Profile
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Weekly Mood Score
            </h4>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-black text-indigo-600">78%</span>
              <span className="text-sm font-bold text-green-600">
                ↑ Improving
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Good! Your mood is higher than last week.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Next Session
            </h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <strong className="block text-base font-bold text-gray-900 mb-1">
                Dr. Smriti (Anxiety Spec.)
              </strong>
              <span className="text-sm text-gray-600 font-medium block mb-3">
                Feb 12, 10:30 AM
              </span>
              <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition">
                View Session Details
              </button>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Mood Distribution
            </h4>
            <div className="flex items-center gap-8">
              <div
                className="w-28 h-28 rounded-full"
                style={{
                  background:
                    "conic-gradient(#10b981 0% 60%, #fbbf24 60% 90%, #ef4444 90% 100%)",
                }}
              ></div>
              <div className="flex flex-col gap-3 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Positive (60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span>Neutral (30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Negative (10%)</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Activity (Points)
            </h4>
            <div className="flex items-end justify-between gap-2 h-36">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "40%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">M</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "70%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">T</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "30%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">W</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-600 rounded-t-lg"
                  style={{ height: "90%" }}
                ></div>
                <span className="text-xs font-black text-indigo-600 mt-2">
                  T
                </span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "50%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">F</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "20%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">S</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "60%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">S</span>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl p-8 border border-black/10">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            Mood Trend Analysis (7 Days)
          </h4>
          <div className="relative">
            <svg viewBox="0 0 500 120" className="w-full h-32">
              <path
                d="M0,100 Q50,70 100,80 T200,30 T300,50 T400,10 T500,40"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="4"
              />
            </svg>
            <div className="flex justify-between text-xs font-black text-gray-400 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
