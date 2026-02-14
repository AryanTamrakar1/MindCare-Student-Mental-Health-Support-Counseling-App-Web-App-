import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-['Inter']">
      <Navbar user={user} />

      <div className="flex flex-1">
        <StudentSidebar user={user} />

        <main className="flex-1 p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-[32px] font-extrabold text-[#111827]">
              Welcome back
            </h1>
            <p className="text-[#6b7280] mt-2">
              Track your mental health and manage your counseling sessions.
            </p>
          </header>

          <div className="grid grid-cols-6 gap-6">
            {/* Mood Card */}
            <section className="col-span-2 bg-white p-[30px] rounded-[20px] border border-[#e5e7eb] flex flex-col">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Weekly Mood Score
              </h2>
              <div className="flex flex-col">
                <span className="text-[48px] font-extrabold text-[#4f46e5] mb-1">
                  54%
                </span>
                <span className="font-bold text-[#374151] text-[16px] mb-3">
                  Slightly below average
                </span>
                <div className="text-[14px] text-[#059669] font-bold">
                  Trend: Improving
                </div>
              </div>
            </section>

            {/* Progression Card */}
            <section className="col-span-2 bg-white p-[30px] rounded-[20px] border border-[#e5e7eb] flex flex-col">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Progression Status
              </h2>
              <div className="flex flex-col">
                <span className="bg-[#4f46e5] text-white px-[14px] py-[6px] rounded-full text-[11px] font-bold self-start mb-4">
                  Level 1: Beginner
                </span>
                <div className="font-extrabold text-[24px] mb-3">
                  150 Points
                </div>
                <div className="bg-[#f3f4f6] h-[10px] rounded-full mb-2.5">
                  <div className="bg-[#4f46e5] h-full rounded-full w-[30%]"></div>
                </div>
                <p className="text-[12px] font-semibold text-[#9ca3af]">
                  Next Level: Active
                </p>
              </div>
            </section>

            {/* Session Card */}
            <section className="col-span-2 bg-white p-[30px] rounded-[20px] border border-[#e5e7eb] flex flex-col">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Next Counseling Session
              </h2>
              <div className="flex flex-col justify-between h-full">
                <div className="mb-5">
                  <p className="font-extrabold text-[20px] text-[#111827] mb-1">
                    Counselor: Janny
                  </p>
                  <p className="font-semibold text-[#6b7280] text-[15px]">
                    Tomorrow at 10:00 AM
                  </p>
                </div>
                <button className="w-full bg-[#eef2ff] text-[#4f46e5] p-[14px] rounded-xl font-bold hover:opacity-80">
                  View Session Details
                </button>
              </div>
            </section>

            {/* Recent Updates */}
            <section className="col-span-3 bg-white p-[30px] rounded-[20px] border border-[#e5e7eb] flex flex-col">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Recent Updates
              </h2>
              <div className="flex flex-col">
                <div className="py-4 border-b border-[#f3f4f6] text-[14px] text-[#4b5563] font-medium">
                  It is time for your Weekly Mood Quiz.
                </div>
                <div className="py-4 border-b border-[#f3f4f6] text-[14px] text-[#4b5563] font-medium">
                  Someone replied to your post in the Community Forum.
                </div>
                <div className="py-4 text-[14px] text-[#4b5563] font-medium">
                  Your session with Janny is confirmed for tomorrow.
                </div>
              </div>
            </section>

            {/* Recommended Counselors */}
            <section className="col-span-3 bg-white p-[30px] rounded-[20px] border border-[#e5e7eb] flex flex-col">
              <h2 className="text-[12px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-6">
                Recommended Counselors
              </h2>
              <div className="flex flex-col">
                <div className="flex justify-between items-center py-4 border-b border-[#f3f4f6]">
                  <div>
                    <span className="block font-bold text-[16px] text-[#111827]">
                      Dr. Smriti
                    </span>
                    <span className="text-[13px] text-[#6b7280] font-medium">
                      Specialist: Anxiety
                    </span>
                  </div>
                  <button className="bg-[#f3f4f6] p-[8px_16px] rounded-lg text-[12px] font-bold">
                    View Profile
                  </button>
                </div>
                <div className="flex justify-between items-center py-4">
                  <div>
                    <span className="block font-bold text-[16px] text-[#111827]">
                      Cslr. Rohan
                    </span>
                    <span className="text-[13px] text-[#6b7280] font-medium">
                      Specialist: Stress
                    </span>
                  </div>
                  <button className="bg-[#f3f4f6] p-[8px_16px] rounded-lg text-[12px] font-bold">
                    View Profile
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

export default StudentDashboard;
