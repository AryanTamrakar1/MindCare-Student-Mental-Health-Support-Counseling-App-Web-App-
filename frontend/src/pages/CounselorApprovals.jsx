import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import ApplicantTable from "../components/counselorApprovals/ApplicantTable";
import ApplicantModal from "../components/counselorApprovals/ApplicantModal";
import { CounselorApprovalsProvider } from "../context/counselorApprovals/counselorApprovalsContext";
import { usecounselorApprovals } from "../hooks/counselorApprovals/usecounselorApprovals";

const CounselorApprovalsInner = () => {
  const { user } = useContext(AuthContext);
  const { pendingUsers, selectedUser, setSelectedUser, handleAction } =
    usecounselorApprovals();

  if (!user) {
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
      <AdminSidebar user={user} />
      <main className="flex-1 ml-[260px] pt-[72px]">
        <div className="p-10">
          <ApplicantTable
            pendingUsers={pendingUsers}
            onViewApplication={(u) => setSelectedUser(u)}
          />
        </div>
      </main>

      {selectedUser && (
        <ApplicantModal
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

const CounselorApprovals = () => {
  return (
    <CounselorApprovalsProvider>
      <CounselorApprovalsInner />
    </CounselorApprovalsProvider>
  );
};

export default CounselorApprovals;
