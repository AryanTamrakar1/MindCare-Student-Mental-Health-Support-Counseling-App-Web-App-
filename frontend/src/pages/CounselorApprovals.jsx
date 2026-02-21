import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import ApplicantTable from "../components/counselorApprovals/ApplicantTable";
import ApplicantModal from "../components/counselorApprovals/ApplicantModal";

const CounselorApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useContext(AuthContext);

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
    <div className="min-h-screen bg-gray-50 flex font-inter">
      <AdminSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Counselor Approvals
            </h2>
            <p className="text-gray-500">
              Manage counselor verification requests.
            </p>
          </div>
          <Navbar />
        </div>

        <ApplicantTable
          pendingUsers={pendingUsers}
          onViewApplication={(u) => setSelectedUser(u)}
        />
      </main>

      <ApplicantModal
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
        onAction={handleAction}
      />
    </div>
  );
};

export default CounselorApprovals;
