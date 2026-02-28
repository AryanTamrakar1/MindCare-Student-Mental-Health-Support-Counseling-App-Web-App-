import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import MindGarden from "../components/gamification/MindGarden";
import LevelBadge from "../components/gamification/LevelBadge";
import PointsDisplay from "../components/gamification/PointsDisplay";
import BadgeCollection from "../components/gamification/BadgeCollection";
import MilestoneLetters from "../components/gamification/MilestoneLetters";
import RestDayIndicator from "../components/gamification/RestDayIndicator";
import API from "../api/axios";

const GamificationPage = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function () {
    fetchGamificationData();
  }, []);

  async function fetchGamificationData() {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/gamification/me", {
        headers: { Authorization: "Bearer " + token },
      });
      setData(res.data);
    } catch (err) {
      setError("Failed to load your progress. Please try again.");
    }
    setLoading(false);
  }

  function handleRestDayUsed(newRemaining) {
    const updatedData = {};
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      updatedData[keys[i]] = data[keys[i]];
    }
    updatedData.restDaysRemaining = newRemaining;
    updatedData.restDaysUsed = 2 - newRemaining;
    setData(updatedData);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex items-center justify-center">
          <p className="text-gray-400 font-bold text-sm">
            Loading your progress...
          </p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex items-center justify-center">
          <p className="text-red-400 font-bold text-sm">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">My Progress</h2>
            <p className="text-gray-500">Your wellness journey, visualized.</p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6 items-stretch">
          <div className="col-span-2 flex flex-col">
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
            />
          </div>
        </div>

        <div className="mb-6">
          <MindGarden level={data.level} moodTrend={data.moodTrend} />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6 items-stretch">
          <div className="flex flex-col">
            <PointsDisplay
              points={data.points}
              currentStreak={data.currentStreak}
              moodTrend={data.moodTrend}
            />
          </div>
          <div className="col-span-2 flex flex-col">
            <BadgeCollection badges={data.badges} />
          </div>
        </div>

        <div>
          <MilestoneLetters letters={data.milestoneLetters} />
        </div>
      </main>
    </div>
  );
};

export default GamificationPage;
