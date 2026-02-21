import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, counselors: 0 });
  const [pendingCounselors, setPendingCounselors] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userRes = await API.get("/admin/all-users");
      const allUsers = userRes.data;
      const studentCount = allUsers.filter((u) => u.role === "Student").length;
      const counselorCount = allUsers.filter(
        (u) => u.role === "Counselor",
      ).length;
      setStats({ students: studentCount, counselors: counselorCount });
      const pendingRes = await API.get("/admin/pending");
      setPendingCounselors(pendingRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Admin Control Center
            </h2>
            <p className="text-gray-500">
              Monitor platform activity and manage professional verifications.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <section className="bg-white rounded-2xl p-6 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Total Students
            </h4>
            <div className="text-center py-4">
              <span className="text-5xl font-black text-indigo-600 block mb-2">
                {stats.students}
              </span>
              <p className="font-bold text-gray-700 text-sm">
                Active registrations
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Approved Counselors
            </h4>
            <div className="text-center py-4">
              <span className="text-5xl font-black text-indigo-600 block mb-2">
                {stats.counselors}
              </span>
              <p className="font-bold text-gray-700 text-sm">
                Verified professionals
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
              Pending Approvals
            </h4>
            <div className="text-center py-2">
              <span className="text-5xl font-black text-indigo-600 block mb-2">
                {pendingCounselors.length < 10
                  ? `0${pendingCounselors.length}`
                  : pendingCounselors.length}
              </span>
              <p className="font-bold text-gray-700 text-sm mb-4">
                New applications
              </p>
              <button
                onClick={() =>
                  navigate("/counselor-approvals", { state: { user } })
                }
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
              >
                Enter Panel
              </button>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl p-8 border border-black/10 mb-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
            Platform Activity Analytics (Last 30 Days)
          </h4>

          <div className="relative">
            <svg viewBox="0 0 800 200" className="w-full h-48">
              <line
                x1="0"
                y1="40"
                x2="800"
                y2="40"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="80"
                x2="800"
                y2="80"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="120"
                x2="800"
                y2="120"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="160"
                x2="800"
                y2="160"
                stroke="#f3f4f6"
                strokeWidth="1"
              />

              <path
                d="M0,160 L80,140 L160,130 L240,110 L320,100 L400,90 L480,80 L560,70 L640,60 L720,50 L800,40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M0,170 L80,160 L160,155 L240,145 L320,140 L400,130 L480,125 L560,115 L640,110 L720,100 L800,90"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M0,180 L80,175 L160,170 L240,165 L320,160 L400,150 L480,145 L560,135 L640,130 L720,120 L800,110"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex justify-between text-xs font-black text-gray-400 mt-3 px-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-500"></span>
              <span className="text-sm font-bold text-gray-700">
                Student Registrations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-indigo-600"></span>
              <span className="text-sm font-bold text-gray-700">
                Session Bookings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
              <span className="text-sm font-bold text-gray-700">
                Community Posts
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
              Pending Verifications
            </h4>
            {pendingCounselors.length > 0 ? (
              <div className="space-y-4">
                {pendingCounselors.slice(0, 3).map((c) => (
                  <div
                    key={c._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div>
                      <span className="block font-bold text-gray-900 mb-1">
                        {c.name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {c.specialization || "Clinical Psychology"}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/counselor-approvals", { state: { user } })
                      }
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase hover:bg-indigo-700 transition"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-400 text-sm italic">
                  No pending applications
                </p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl p-8 border border-black/10">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
              Recent Community Posts
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 font-medium">
                  Anonymous: "Struggling with skill gap anxiety..."
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 font-medium">
                  Anonymous: "Exam pressure is getting too much..."
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 font-medium">
                  Anonymous: "Seeking advice on career paths..."
                </p>
              </div>
            </div>
            <button className="text-indigo-600 font-bold text-sm mt-6 hover:underline">
              Manage All Posts →
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
