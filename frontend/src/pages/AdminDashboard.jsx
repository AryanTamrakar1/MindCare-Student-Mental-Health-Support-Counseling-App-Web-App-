import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Clock, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import PlatformChartCard from "../components/adminDashboard/PlatformChartCard";
import RecentPostsCard from "../components/adminDashboard/RecentPostsCard";

const StatCard = ({ label, value, sub, icon: Icon, accent }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", value: "text-blue-700" },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      value: "text-emerald-700",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      value: "text-amber-600",
    },
  };
  const c = colorMap[accent];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 " +
            c.bg
          }
        >
          <Icon size={18} className={c.icon} />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            {label}
          </p>
          <p
            className={
              "text-3xl font-black tracking-tight leading-tight " + c.value
            }
          >
            {value}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium border-t border-slate-100 pt-4">
        {sub}
      </p>
    </div>
  );
};

const PendingRow = ({ name, specialization, onView }) => {
  return (
    <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-400 truncate">{specialization}</p>
        </div>
      </div>
      <button
        onClick={onView}
        className="shrink-0 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
      >
        Review
      </button>
    </div>
  );
};

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
      let studentCount = 0;
      let counselorCount = 0;
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].role === "Student") studentCount++;
        if (allUsers[i].role === "Counselor") counselorCount++;
      }
      setStats({ students: studentCount, counselors: counselorCount });
      const pendingRes = await API.get("/admin/pending");
      setPendingCounselors(pendingRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  if (!user || user.role !== "Admin") return null;

  const pendingCount = pendingCounselors.length;
  const paddedPending =
    pendingCount < 10 ? "0" + pendingCount : "" + pendingCount;
  const goToApprovals = () =>
    navigate("/counselor-approvals", { state: { user } });
  const hasPending = pendingCount > 0;
  const noPending = pendingCount === 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar user={user} />

      <main className="flex-1 ml-[280px] px-10 py-8 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
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

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-5">
            <StatCard
              label="Total Students"
              value={stats.students}
              sub="Registered on the platform"
              icon={Users}
              accent="blue"
            />
            <StatCard
              label="Approved Counselors"
              value={stats.counselors}
              sub="Verified professionals"
              icon={UserCheck}
              accent="emerald"
            />
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
                    Pending Approvals
                  </p>
                  <p className="text-3xl font-black tracking-tight leading-tight text-amber-600">
                    {paddedPending}
                  </p>
                </div>
              </div>
              <button
                onClick={goToApprovals}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2"
              >
                Open Counselor Approval <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="px-6 pt-5 pb-2 border-b border-slate-100">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                Platform Activity
              </p>
            </div>
            <div className="p-6">
              <PlatformChartCard />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 items-start">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="px-6 pt-5 pb-2 border-b border-slate-100">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                  Pending Verifications
                </p>
              </div>
              <div className="p-6">
                {hasPending && (
                  <div className="flex flex-col gap-2.5">
                    {pendingCounselors.slice(0, 4).map((c) => (
                      <PendingRow
                        key={c._id}
                        name={c.name}
                        specialization={
                          c.specialization || "Clinical Psychology"
                        }
                        onView={goToApprovals}
                      />
                    ))}
                  </div>
                )}
                {noPending && (
                  <div className="flex flex-col items-center justify-center h-24 gap-2">
                    <UserCheck size={24} className="text-slate-200" />
                    <p className="text-slate-400 text-xs">All caught up!</p>
                  </div>
                )}
                {hasPending && (
                  <button
                    onClick={goToApprovals}
                    className="mt-4 pt-3 border-t border-slate-100 w-full text-left text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    View all {pendingCount} applications{" "}
                    <ArrowRight size={11} />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="px-6 pt-5 pb-2 border-b border-slate-100">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                  Community Posts
                </p>
              </div>
              <div className="p-6">
                <RecentPostsCard />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
