import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "Admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />

      <div className="flex flex-1">
        <AdminSidebar user={user} />

        <main className="flex-1 p-10">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Control Center
            </h1>
            <p className="text-gray-500 mt-2">
              Welcome back, {user?.name || "Aryan Student"}. Here is an overview
              of MindCare.
            </p>
          </header>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
