import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

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
      // Fetch Stats for Students and Counselors
      const userRes = await API.get("/admin/all-users");
      const allUsers = userRes.data;
      const studentCount = allUsers.filter((u) => u.role === "Student").length;
      const counselorCount = allUsers.filter(
        (u) => u.role === "Counselor",
      ).length;
      setStats({ students: studentCount, counselors: counselorCount });

      // Fetch Pending Counselors
      const pendingRes = await API.get("/admin/pending");
      setPendingCounselors(pendingRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      <div className="flex flex-1">
        <AdminSidebar user={user} />

        <main className="flex-1 p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-[32px] font-[800] text-gray-900">
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-2">
              Monitor platform activity and manage professional verifications.
            </p>
          </header>

          <div className="grid grid-cols-6 gap-6 mb-6">
            {/* Total Students */}
            <section className="col-span-2 bg-white p-8 rounded-[20px] border border-gray-200 flex flex-col min-h-[220px]">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-4">
                Total Students
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-[48px] font-[800] text-indigo-600 leading-none mb-2">
                  {stats.students}
                </span>
                <p className="font-[700] text-gray-700 text-lg">
                  Active registrations
                </p>
              </div>
            </section>

            {/* Approved Counselors */}
            <section className="col-span-2 bg-white p-8 rounded-[20px] border border-gray-200 flex flex-col min-h-[220px]">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-4">
                Approved Counselors
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-[48px] font-[800] text-indigo-600 leading-none mb-2">
                  {stats.counselors}
                </span>
                <p className="font-[700] text-gray-700 text-lg">
                  Verified professionals
                </p>
              </div>
            </section>

            {/* Pending Approvals Count */}
            <section className="col-span-2 bg-white p-8 rounded-[20px] border border-gray-200 flex flex-col min-h-[220px]">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-4">
                Pending Approvals
              </h2>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-[48px] font-[800] text-indigo-600 leading-none mb-2">
                  {pendingCounselors.length < 10
                    ? `0${pendingCounselors.length}`
                    : pendingCounselors.length}
                </span>
                <p className="font-[700] text-gray-700 text-lg mb-4">
                  New applications
                </p>
                <button
                  onClick={() =>
                    navigate("/counselor-approvals", { state: { user } })
                  }
                  className="w-full bg-indigo-50 text-indigo-600 p-3 rounded-xl font-[700] hover:bg-indigo-100 transition"
                >
                  Enter Panel
                </button>
              </div>
            </section>
          </div>
          {/* Pending Verifications & Community Posts */}
          <div className="grid grid-cols-6 gap-6">
            {/* Pending Verifications List */}
            <section className="col-span-3 bg-white p-8 rounded-[20px] border border-gray-200">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-6">
                Pending Verifications
              </h2>
              <div className="divide-y divide-gray-100">
                {pendingCounselors.length > 0 ? (
                  pendingCounselors.slice(0, 3).map((c) => (
                    <div
                      key={c._id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div>
                        <span className="block font-[700] text-gray-900">
                          {c.name}
                        </span>
                        <span className="text-[13px] text-gray-500">
                          {c.specialization || "Clinical Psychology"}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          navigate("/counselor-approvals", { state: { user } })
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-[12px] font-[700] hover:bg-indigo-700 transition"
                      >
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-gray-400 text-sm italic">
                    No pending applications
                  </p>
                )}
              </div>
            </section>

            {/* Recent Community Posts*/}
            <section className="col-span-3 bg-white p-8 rounded-[20px] border border-gray-200">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest mb-6">
                Recent Community Posts
              </h2>
              <div className="divide-y divide-gray-100">
                <div className="py-3 text-[14px] text-gray-600 font-[500]">
                  Anonymous: "Struggling with skill gap anxiety..."
                </div>
                <div className="py-3 text-[14px] text-gray-600 font-[500]">
                  Anonymous: "Exam pressure is getting too much..."
                </div>
                <div className="py-3 text-[14px] text-gray-600 font-[500]">
                  Anonymous: "Seeking advice on career paths..."
                </div>
              </div>
              <button className="text-indigo-600 font-[700] text-[13px] mt-4 hover:underline">
                Manage All Posts
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
