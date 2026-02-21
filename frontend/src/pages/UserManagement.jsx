import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import UsersTable from "../components/userManagement/UsersTable";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/all-users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this account?")) {
      try {
        await API.delete(`/admin/delete-user/${id}`);
        alert("User removed");
        fetchAllUsers();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleResetToPending = async (id) => {
    if (window.confirm("Reset this counselor's status back to Pending?")) {
      try {
        await API.put(`/admin/reset-to-pending/${id}`);
        alert(
          "Account reset to Pending. Counselor has been notified by email.",
        );
        fetchAllUsers();
      } catch (err) {
        alert("Reset failed. Please try again.");
      }
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar user={currentUser} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Users...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={currentUser} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              User Management
            </h2>
            <p className="text-gray-500">
              View, monitor, and manage all registered accounts on the platform.
            </p>
          </div>
          <Navbar />
        </div>

        <UsersTable
          users={users}
          onDelete={handleDelete}
          onResetToPending={handleResetToPending}
        />
      </main>
    </div>
  );
};

export default UserManagement;
