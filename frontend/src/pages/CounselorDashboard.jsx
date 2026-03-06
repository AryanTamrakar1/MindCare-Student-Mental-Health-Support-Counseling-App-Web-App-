import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import PendingCountCard from "../components/counselorDashboard/PendingCountCard";
import AverageRatingCard from "../components/counselorDashboard/AverageRatingCard";
import CounselorNextSessionCard from "../components/counselorDashboard/CounselorNextSessionCard";
import SessionCompletionChart from "../components/counselorDashboard/SessionCompletionChart";
import RecentActivityCard from "../components/counselorDashboard/RecentActivityCard";

const CounselorDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <CounselorSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Dashboard...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <CounselorSidebar user={user} />

      <main className="flex-1 ml-[280px] px-10 py-8 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Counselor Workspace
            </h2>
            <p className="text-gray-500">
              Manage your appointments and support your students.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-5">
            <PendingCountCard />
            <AverageRatingCard />
            <CounselorNextSessionCard />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="px-6 pt-5 pb-2 border-b border-slate-100">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                Session Completion Rate
              </p>
            </div>
            <div className="p-6">
              <SessionCompletionChart />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="px-6 pt-5 pb-2 border-b border-slate-100">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                Recent Community Activity
              </p>
            </div>
            <div className="p-6">
              <RecentActivityCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CounselorDashboard;
