import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)} ${month}, ${year}`;
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

        <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden">
          <div className="px-8 py-8 flex justify-between items-center border-b border-black/10">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                All Registered Users
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Manage access and roles
              </p>
            </div>
            <span className="text-xs font-black bg-indigo-50 px-4 py-2 rounded-full text-indigo-600 border border-indigo-100 uppercase">
              Total: {users.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-gray-50/50">
                  <th className="text-left px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest w-[20%]">
                    Name
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest w-[22%]">
                    Email
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest w-[12%]">
                    Status
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest w-[12%]">
                    Role
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest w-[16%]">
                    Joined Date
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-black text-black uppercase tracking-widest w-[18%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="bg-white border-b border-black/5 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-8 py-6 w-[20%]">
                        <div className="font-bold text-gray-900 text-base">
                          {u.name}
                        </div>
                      </td>

                      <td className="px-8 py-6 w-[22%]">
                        <div className="text-sm text-black font-bold">
                          {u.email}
                        </div>
                      </td>

                      <td className="px-8 py-6 w-[12%]">
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {u._id ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-8 py-6 w-[12%]">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                            u.role === "Student"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                          }`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-8 py-6 w-[16%]">
                        <div className="text-sm text-gray-600 font-bold">
                          {formatDate(u.createdAt)}
                        </div>
                      </td>

                      <td className="px-8 py-6 w-[18%]">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-100"
                        >
                          Remove Account
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">
                        No users registered in the system
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
