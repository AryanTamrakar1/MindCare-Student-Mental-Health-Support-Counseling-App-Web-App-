import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";

const CounselorDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CounselorSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
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

        <div className="grid grid-cols-3 gap-6 mb-6">
          <section className="bg-white rounded-2xl p-8 border border-black/10 flex flex-col items-center justify-between min-h-[240px]">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 self-start">
              Pending Requests
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-indigo-600 mb-2">
                03
              </span>
              <p className="font-bold text-gray-700">Waiting for review</p>
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
              Review Now
            </button>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-black/10 flex flex-col items-center justify-between min-h-[240px]">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 self-start">
              Average Rating
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-indigo-600 mb-2">
                4.8
              </span>
              <p className="font-bold text-gray-700 mb-2">
                From 24 total sessions
              </p>
              <div className="text-yellow-400 text-xl">★★★★★</div>
            </div>
            <div className="w-full h-[52px]"></div>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-black/10 flex flex-col items-center justify-between min-h-[240px]">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 self-start">
              Next Session
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="font-black text-xl text-gray-900 mb-1">
                Student: Rohan K.
              </p>
              <p className="font-semibold text-gray-500">Today at 2:00 PM</p>
            </div>
            <button className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-100 transition">
              Start Session
            </button>
          </section>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Session Volume (7 Days)
            </h4>
            <div className="flex items-end justify-between gap-2 h-40">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "60%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">M</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "40%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">T</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-600 rounded-t-lg"
                  style={{ height: "85%" }}
                ></div>
                <span className="text-xs font-black text-indigo-600 mt-2">
                  W
                </span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "30%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">T</span>
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
                  style={{ height: "10%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">S</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-indigo-100 rounded-t-lg"
                  style={{ height: "5%" }}
                ></div>
                <span className="text-xs font-black text-gray-400 mt-2">S</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Student Cases by Type
            </h4>
            <div className="flex items-center gap-8">
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  background:
                    "conic-gradient(#4f46e5 0% 45%, #3b82f6 45% 80%, #9ca3af 80% 100%)",
                }}
              ></div>
              <div className="flex flex-col gap-3 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                  <span>Anxiety (45%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Stress (35%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  <span>Other (20%)</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl p-8 border border-black/10">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
            Recent Community Activity
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
              <div>
                <strong className="block font-bold text-gray-900 mb-1">
                  Anonymous Post: Skill Gap Anxiety
                </strong>
                <p className="text-sm text-gray-500 font-medium">
                  New reply needed - 3 students waiting
                </p>
              </div>
              <button className="bg-white border border-gray-200 px-5 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-50 transition">
                View Post
              </button>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
              <div>
                <strong className="block font-bold text-gray-900 mb-1">
                  Anonymous Post: Exam Pressure
                </strong>
                <p className="text-sm text-gray-500 font-medium">
                  5 students discussed this today
                </p>
              </div>
              <button className="bg-white border border-gray-200 px-5 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-50 transition">
                View Post
              </button>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
              <div>
                <strong className="block font-bold text-gray-900 mb-1">
                  General: Sleep Hygiene Tips
                </strong>
                <p className="text-sm text-gray-500 font-medium">
                  Your last reply was marked helpful
                </p>
              </div>
              <button className="bg-white border border-gray-200 px-5 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-50 transition">
                View Post
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CounselorDashboard;
