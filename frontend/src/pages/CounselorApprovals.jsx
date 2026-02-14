import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

const CounselorApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useContext(AuthContext);
  const BACKEND_URL = "http://localhost:5050";

  useEffect(() => {
    fetchPending();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar user={user} />

      <div className="flex flex-1">
        <AdminSidebar user={user} />

        <main className="flex-1 p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Counselor Approvals
            </h1>
            <p className="text-gray-500 mt-2">
              Manage counselor verification requests.
            </p>
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

      {/* VIEW APPLICATION MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full my-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="p-10">
              {/* Header Info */}
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
                  className="text-gray-400 hover:text-gray-600 transition text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Counselor Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                    Qualification
                  </p>
                  <p className="font-bold text-gray-800">
                    {selectedUser.qualifications || "Not Provided"}
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
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <p className="font-bold text-gray-800">
                    {selectedUser.phone || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                    Experience
                  </p>
                  <p className="font-bold text-gray-800">
                    {selectedUser.experience
                      ? `${selectedUser.experience} Years`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Specialization Tags */}
              <div className="mb-6">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                  Specialization
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                    {selectedUser.specialization || "General"}
                  </span>
                </div>
              </div>

              {/* Verification Photo */}
              <div className="mb-6">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">
                  Verification Document
                </p>
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 min-h-[200px] flex items-center justify-center">
                  {selectedUser.verificationPhoto ? (
                    <img
                      src={`${BACKEND_URL}/${selectedUser.verificationPhoto}`}
                      alt="Verification"
                      className="w-full h-auto max-h-[400px] object-contain"
                      onError={(e) => {
                        // If the database saves only the filename, then must point to the subfolder
                        if (
                          !selectedUser.verificationPhoto.includes(
                            "verifications",
                          )
                        ) {
                          e.target.src = `${BACKEND_URL}/uploads/verifications/${selectedUser.verificationPhoto}`;
                        }
                      }}
                    />
                  ) : (
                    <p className="text-gray-400 italic">No Photo Uploaded</p>
                  )}
                </div>
              </div>

              {/* Statement of Purpose / Bio */}
              <div className="mb-10">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                  Statement of Purpose
                </p>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{selectedUser.bio || "No statement provided."}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleAction(selectedUser._id, "Approved")}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition active:scale-95 shadow-lg shadow-emerald-100"
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
