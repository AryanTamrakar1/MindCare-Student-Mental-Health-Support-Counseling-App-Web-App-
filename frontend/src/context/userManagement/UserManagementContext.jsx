import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const UserManagementContext = createContext(null);

export const UserManagementProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAllUsers() {
    try {
      setLoading(true);
      const res = await API.get("/admin/all-users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users");
      setLoading(false);
    }
  }

  useEffect(function () {
    fetchAllUsers();
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to remove this account?")) {
      try {
        await API.delete("/admin/delete-user/" + id);
        alert("User removed");
        fetchAllUsers();
      } catch (err) {
        alert("Delete failed");
      }
    }
  }

  async function handleResetToPending(id) {
    if (window.confirm("Reset this counselor's status back to Pending?")) {
      try {
        await API.put("/admin/reset-to-pending/" + id);
        alert("Account reset to Pending. Counselor has been notified by email.");
        fetchAllUsers();
      } catch (err) {
        alert("Reset failed. Please try again.");
      }
    }
  }

  return (
    <UserManagementContext.Provider
      value={{ users, loading, handleDelete, handleResetToPending }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagementContext = () => {
  const ctx = useContext(UserManagementContext);
  if (!ctx) throw new Error("useUserManagementContext must be used inside UserManagementProvider");
  return ctx;
};