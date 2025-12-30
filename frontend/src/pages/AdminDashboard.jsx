import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/");
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

  useEffect(() => {
    if (showApprovalPanel) {
      fetchPending();
    }
  }, [showApprovalPanel]);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                      Qualification
                    </p>
                    <p className="font-bold text-gray-800">
                      {selectedUser.qualifications}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                      License No.
                    </p>
                    <p className="font-bold text-gray-800">
                      {selectedUser.licenseNo || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                      Phone Number
                    </p>
                    <p className="font-bold text-gray-800">
                      {selectedUser.phone || "Not Provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                      Experience
                    </p>
                    <p className="font-bold text-gray-800">
                      {selectedUser.experience} Years
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 ml-1">
                    Verification Document
                  </p>
                  <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100 overflow-hidden">
                    {selectedUser.verificationPhoto ? (
                      <a
                        href={`http://localhost:5050/uploads/verifications/${selectedUser.verificationPhoto}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block group relative"
                      >
                        <img
                          src={`http://localhost:5050/uploads/verifications/${selectedUser.verificationPhoto}`}
                          alt="Verification Document"
                          className="w-full h-48 object-cover rounded-xl transition group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20 text-white font-bold text-sm">
                          Click to View Full Size
                        </div>
                      </a>
                    ) : (
                      <div className="h-20 flex items-center justify-center text-gray-400 italic text-sm">
                        No verification photo uploaded.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 ml-1">
                    Specializations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.specialization?.split(",").map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl text-xs font-bold border border-indigo-100"
                      >
                        {tag.trim()}
                      </span>
                    )) || (
                      <span className="text-gray-400 italic">
                        No specializations listed
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 ml-1">
                    Motivation & Statement of Purpose
                  </p>
                  <div className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100 text-gray-700 leading-relaxed italic text-sm">
                    "
                    {selectedUser.bio ||
                      "The counselor did not provide a motivation statement."}
                    "
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => handleAction(selectedUser._id, "Approved")}
                    className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 active:scale-95"
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
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-2">
              Manage counselor verification requests.
            </p>
          </div>
          {showApprovalPanel && (
            <button
              onClick={() => setShowApprovalPanel(false)}
              className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
            >
              ← Back to Overview
            </button>
          )}
        </header>

        {!showApprovalPanel ? (

          <div className="flex justify-center mt-12">
            <div className="bg-white p-16 rounded-[3rem] shadow-sm border border-gray-100 text-center max-w-2xl w-full">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Counselor Requests
              </h2>
              <p className="text-gray-500 mt-4 mb-8">
                Review and verify professional registrations for MindCare.
              </p>
              <button
                onClick={() => setShowApprovalPanel(true)}
                className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Enter Approval Panel
              </button>
            </div>
          </div>
        ) : (

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
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;