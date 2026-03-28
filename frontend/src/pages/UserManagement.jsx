import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import UsersTable from "../components/userManagement/UsersTable";
import { UserManagementProvider } from "../context/userManagement/UserManagementContext";
import { useUserManagement } from "../hooks/userManagement/useUserManagement";

const UserManagementInner = () => {
  const { user: currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return null;
  }
  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#EFF4FB",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Navbar />
      <AdminSidebar user={currentUser} />
      <main className="flex-1 ml-[260px] pt-[72px]">
        <div className="p-10">
          <UsersTable />
        </div>
      </main>
    </div>
  );
};

const UserManagement = () => {
  return (
    <UserManagementProvider>
      <UserManagementInner />
    </UserManagementProvider>
  );
};

export default UserManagement;
