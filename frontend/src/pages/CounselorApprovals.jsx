import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

const CounselorApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/");
    } else {
      fetchPending();
    }
  }, [user, navigate]);

  const fetchPending = async () => {
    try {
      const res = await API.get("/admin/pending");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
    }
  };

  const handleAction = async (id, newStatus) => {
    try {
      await API.put("/admin/update-status", { userId: id, status: newStatus });
      alert(`Counselor has been ${newStatus}`);
      setSelectedUser(null);
      fetchPending();
    } catch (err) {
      alert("Action failed");
    }
  };

  if (!user || user.role !== "Admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <AdminSidebar user={user} />

        <main className="flex-1 p-10">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Counselor Approvals
              </h1>
              <p className="text-gray-500 mt-2">
                Manage counselor verification requests.
              </p>
            </div>
          </header>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Pending Verification
              </h2>
              <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase">
                {pendingUsers.length} Applications
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">
                    <th className="p-6">Counselor</th>
                    <th className="p-6">Submission Status</th>
                    <th className="p-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-20 text-center text-gray-400 italic"
                      >
                        No pending applications found.
                      </td>
                    </tr>
                  ) : (
                    pendingUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-6">
                          <div className="font-bold text-gray-900 text-lg">
                            {u.name}
                          </div>
                          <div className="text-gray-500 text-xs">{u.email}</div>
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">
                            Waiting for Review
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition"
                          >
                            View Application →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full my-8 shadow-2xl relative">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">
                      {selectedUser.name}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => handleAction(selectedUser._id, "Approved")}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition active:scale-95"
                >
                  Approve Professional
                </button>
                <button
                  onClick={() => handleAction(selectedUser._id, "Rejected")}
                  className="flex-1 bg-white text-rose-500 border-2 border-rose-100 py-4 rounded-2xl font-bold hover:bg-rose-50 transition active:scale-95"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorApprovals;
