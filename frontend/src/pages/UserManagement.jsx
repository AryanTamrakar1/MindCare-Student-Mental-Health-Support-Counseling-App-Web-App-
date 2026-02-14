import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await API.get("/admin/all-users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={currentUser} />

      <div className="flex flex-1">
        <AdminSidebar user={currentUser} />
        <main className="flex-1 p-10 overflow-y-auto">
          <header className="mb-10">
            <h1 className="text-[32px] font-[800] text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500 mt-2">
              View, monitor, and manage all registered accounts on the platform.
            </p>
          </header>

          <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-[30px] py-[25px] flex justify-between items-center border-bottom border-gray-100">
              <h2 className="text-[12px] font-[800] text-gray-400 uppercase tracking-wider">
                All Registered Users
              </h2>
              <span className="text-[12px] font-[800] bg-gray-100 px-3 py-1 rounded-[20px] text-gray-600">
                Total: {users.length}
              </span>
            </div>

            <div className="px-5 pb-5">
              <table className="w-full border-collapse mt-[10px]">
                <thead>
                  <tr>
                    <th className="text-left p-[15px] text-[11px] font-[800] text-gray-400 uppercase">
                      User Information
                    </th>
                    <th className="text-left p-[15px] text-[11px] font-[800] text-gray-400 uppercase">
                      Role
                    </th>
                    <th className="text-left p-[15px] text-[11px] font-[800] text-gray-400 uppercase">
                      Account Status
                    </th>
                    <th className="p-[15px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                    >
                      <td className="p-[20px_15px]">
                        <div className="font-[700] text-[#111827] text-[15px]">
                          {u.name}
                        </div>
                        <div className="text-[13px] text-gray-500">
                          {u.email}
                        </div>
                      </td>
                      <td className="p-[20px_15px]">
                        <span
                          className={`p-[5px_12px] rounded-[6px] text-[11px] font-[800] uppercase ${
                            u.role === "Student"
                              ? "bg-[#eef2ff] text-[#4f46e5]"
                              : "bg-[#ecfdf5] text-[#059669]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-[20px_15px]">
                        <span className="text-[#059669] font-[700] text-[14px]">
                          Active
                        </span>
                      </td>
                      <td className="p-[20px_15px] text-right">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-[#fee2e2] text-[#ef4444] border-none p-[8px_16px] rounded-[8px] text-[12px] font-[700] cursor-pointer hover:bg-[#ef4444] hover:text-white transition-all duration-200"
                        >
                          Remove Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
