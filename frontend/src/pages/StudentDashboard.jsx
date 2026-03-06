import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import SmartCounselorCard from "../components/recommendations/SmartCounselorCard";
import MoodScoreCard from "../components/studentDashboard/MoodScoreCard";
import MoodTrendCard from "../components/studentDashboard/MoodTrendCard";
import API from "../api/axios";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [gamification, setGamification] = useState(null);

  useEffect(function () {
    async function fetchGamification() {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/gamification/me", {
          headers: { Authorization: "Bearer " + token },
        });
        setGamification(res.data);
      } catch (err) {}
    }
    fetchGamification();
  }, []);

  function getProgressPercent() {
    if (!gamification) return 0;
    if (gamification.level >= 5) return 100;
    const LEVEL_THRESHOLDS = [0, 20, 40, 60, 80];
    const currentLevelStart = LEVEL_THRESHOLDS[gamification.level - 1];
    const pointsSinceLevel = gamification.points - currentLevelStart;
    const pointsNeeded = gamification.nextLevelPoints - currentLevelStart;
    const percent = Math.round((pointsSinceLevel / pointsNeeded) * 100);
    if (percent < 0) return 0;
    if (percent > 100) return 100;
    return percent;
  }

  function getLevelColor() {
    if (!gamification) return "from-indigo-600 to-indigo-800";
    if (gamification.level === 1) return "from-green-500 to-green-700";
    if (gamification.level === 2) return "from-teal-500 to-teal-700";
    if (gamification.level === 3) return "from-pink-500 to-pink-700";
    if (gamification.level === 4) return "from-indigo-600 to-indigo-800";
    if (gamification.level === 5) return "from-amber-500 to-amber-700";
    return "from-indigo-600 to-indigo-800";
  }

  function getProgressLabel() {
    if (gamification && gamification.level < 5)
      return "Progress to Level " + (gamification.level + 1);
    return "Maximum Level Reached";
  }

  function getPointsDisplay() {
    if (gamification) return gamification.points;
    return "—";
  }

  function getLevelDisplay() {
    if (gamification)
      return "Level " + gamification.level + ": " + gamification.levelTitle;
    return "Loading...";
  }

  function getBadges() {
    if (gamification && gamification.badges.length > 0) {
      return gamification.badges.slice(0, 3);
    }
    return [];
  }

  const progressPercent = getProgressPercent();
  const badges = getBadges();

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

        <section
          className={
            "bg-gradient-to-br " +
            getLevelColor() +
            " rounded-2xl p-8 mb-6 text-white shadow-lg"
          }
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black">Your Progression</h3>
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              {getLevelDisplay()}
            </span>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center justify-center border-4 border-white/30 rounded-full w-32 h-32">
              <span className="text-3xl font-black">{getPointsDisplay()}</span>
              <span className="text-xs uppercase tracking-wider opacity-80">
                Total Points
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{getProgressLabel()}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="bg-white/20 h-3 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
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
                          className="bg-white/15 px-3 py-1 rounded-lg text-xs font-bold"
                        >
                          {badge.name}
                        </span>
                      );
                    })}
                  {badges.length === 0 && (
                    <span className="bg-white/15 px-3 py-1 rounded-lg text-xs font-bold opacity-60">
                      No badges yet
                    </span>
                  )}
                </div>
                <button
                  onClick={function () {
                    navigate("/student/gamification");
                  }}
                  className="bg-white/20 hover:bg-white/30 transition px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shrink-0"
                >
                  View My Progress
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            Your Well-being Overview
          </h4>
          <div className="grid grid-cols-3 gap-5 items-stretch">
            <MoodTrendCard />
            <MoodScoreCard />
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            Recommended Counselors
          </h4>
          <SmartCounselorCard />
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
