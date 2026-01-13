import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CounselorSidebar from "../components/CounselorSidebar";

const CounselorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  useEffect(() => {
    if (!user || user.role !== "Counselor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "Counselor") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      <div className="flex flex-1">
        <CounselorSidebar user={user} />

        <main className="flex-1 p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-[32px] font-[800] text-gray-900">
              Counselor Workspace
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your appointments and support your students.
            </p>
          </header>

          <div className="grid grid-cols-6 gap-6">
            
            {/* Pending Requests */}
            <section className="col-span-2 bg-white p-8 rounded-[20px] border border-gray-200 flex flex-col h-[250px]">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-4">
                Pending Requests
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-[48px] font-[800] text-indigo-600 leading-none mb-2">
                  03
                </span>
                <p className="font-[700] text-gray-700 text-base">
                  Waiting for review
                </p>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-[700] text-sm hover:bg-indigo-700 transition mt-4">
                View
              </button>
            </section>

            {/* Average Rating */}
            <section className="col-span-2 bg-white p-8 rounded-[20px] border border-gray-200 flex flex-col h-[250px]">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-4">
                Average Rating
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-[48px] font-[800] text-indigo-600 leading-none mb-2">
                  4.8
                </span>
                <p className="font-[700] text-gray-700 text-base">
                  From 24 total sessions
                </p>
              </div>
              <div className="h-[44px] mt-4"></div> 
            </section>

            {/* Next Confirmed Session */}
            <section className="col-span-2 bg-white p-8 rounded-[20px] border border-gray-200 flex flex-col h-[250px]">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-4">
                Next Confirmed Session
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="font-[800] text-xl text-gray-900 mb-1">
                  Student: Rohan K.
                </p>
                <p className="font-[600] text-gray-500 text-sm">
                  Today at 2:00 PM
                </p>
              </div>
              <button className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-[700] text-sm hover:bg-indigo-100 transition mt-4">
                Start Session
              </button>
            </section>

            {/* Recent Notifications */}
            <section className="col-span-3 bg-white p-8 rounded-[20px] border border-gray-200">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-6">
                Recent Notifications
              </h2>
              <div className="divide-y divide-gray-100">
                <div className="py-4 text-[14px] text-gray-600 font-[500]">
                  New session request from Anjali Sharma.
                </div>
                <div className="py-4 text-[14px] text-gray-600 font-[500]">
                  Your registration has been approved by Admin.
                </div>
                <div className="py-4 text-[14px] text-gray-600 font-[500]">
                  You received a new 5-star rating.
                </div>
              </div>
            </section>

            {/* Forum Activity */}
            <section className="col-span-3 bg-white p-8 rounded-[20px] border border-gray-200">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-6">
                Forum Activity
              </h2>
              <div className="divide-y divide-gray-100">
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="block font-[700] text-gray-900">
                      Anonymous Post: Skill Gap Anxiety
                    </span>
                    <span className="text-[13px] text-gray-500">
                      New reply needed
                    </span>
                  </div>
                  <button className="bg-gray-100 px-4 py-2 rounded-lg text-[12px] font-[700] hover:bg-gray-200 transition">
                    Reply Now
                  </button>
                </div>
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="block font-[700] text-gray-900">
                      Anonymous Post: Exam Pressure
                    </span>
                    <span className="text-[13px] text-gray-500">
                      3 Students discussed this
                    </span>
                  </div>
                  <button className="bg-gray-100 px-4 py-2 rounded-lg text-[12px] font-[700] hover:bg-gray-200 transition">
                    View Post
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CounselorDashboard;