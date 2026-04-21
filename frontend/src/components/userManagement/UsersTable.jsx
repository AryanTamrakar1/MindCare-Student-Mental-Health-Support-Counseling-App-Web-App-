import React from "react";
import { useState } from "react";
import { useUserManagement } from "../../hooks/userManagement/useUserManagement";
import Pagination from "./Pagination";

const ROWS_PER_PAGE = 10;

function getProfilePhotoUrl(u) {
  if (!u.verificationPhoto) {
    const name = u.name || "User";
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=2563EB&color=fff&size=200";
  }
  return u.verificationPhoto;
}

function getStatusBadge(u) {
  if (u.role === "Student" && u.status === "Approved") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
        Active
      </span>
    );
  }
  if (u.role === "Student" && u.status === "Pending") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
        Pending
      </span>
    );
  }
  if (u.role === "Counselor" && u.status === "Approved") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
        Approved
      </span>
    );
  }
  if (u.role === "Counselor" && u.status === "Rejected") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
        Rejected
      </span>
    );
  }
  if (u.role === "Counselor") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
      {u.status || "—"}
    </span>
  );
}

function getStatusValue(u) {
  if (u.role === "Student") return "active";
  if (u.role === "Counselor" && u.status === "Approved") return "approved";
  if (u.role === "Counselor" && u.status === "Rejected") return "rejected";
  if (u.role === "Counselor") return "pending";
  return (u.status || "").toLowerCase();
}

function getRoleBadge(u) {
  if (u.role === "Student") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#EEF2FF] text-[#2563EB] border border-[#C7D2FE]">
        Student
      </span>
    );
  }
  if (u.role === "Counselor") {
    return (
      <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
        Counselor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
      {u.role.replace("_", " ")}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const suffix = (d) => {
    if (d > 3 && d < 21) return "th";
    if (d % 10 === 1) return "st";
    if (d % 10 === 2) return "nd";
    if (d % 10 === 3) return "rd";
    return "th";
  };
  return `${day}${suffix(day)} ${month}, ${year}`;
}

const UsersTable = () => {
  const {
    users,
    handleDelete: onDelete,
    handleResetToPending: onResetToPending,
  } = useUserManagement();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = [];
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" ||
      getStatusValue(u) === statusFilter.toLowerCase();

    if (matchesSearch && matchesRole && matchesStatus) {
      filtered.push(u);
    }
  }

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  const paginated = [];
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = page * ROWS_PER_PAGE;
  for (let i = startIndex; i < endIndex && i < filtered.length; i++) {
    paginated.push(filtered[i]);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function clearSearch() {
    setSearch("");
    setPage(1);
  }

  function handleRoleChange(e) {
    setRoleFilter(e.target.value);
    setPage(1);
  }

  function handleStatusChange(e) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  const columns =
    "50px 1px minmax(160px, 2.2fr) 1px minmax(180px, 2fr) 1px minmax(100px, 1.2fr) 1px minmax(100px, 1.2fr) 1px minmax(130px, 1.4fr) 1px minmax(200px, 1.8fr)";

  return (
    <div
      className="bg-white border border-[#E5E9F2] min-w-[1050px]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex items-center gap-3 px-7 py-5 border-b border-[#E5E9F2]">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-9 py-2.5 text-[14px] font-medium text-[#111827] border border-[#E5E9F2] bg-[#F9FAFB] outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
          />
          {search.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={handleRoleChange}
          className="px-4 py-2.5 text-[14px] font-medium text-[#374151] border border-[#E5E9F2] bg-[#F9FAFB] outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Counselor">Counselor</option>
          <option value="Admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="px-4 py-2.5 text-[14px] font-medium text-[#374151] border border-[#E5E9F2] bg-[#F9FAFB] outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div
        className="grid border-b border-[#E5E9F2] bg-[#F9FAFB]"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="px-5 py-4 flex items-center">
          <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">#</span>
        </div>
        {["Name", "Email", "Status", "Role", "Joined", "Action"].map((label, i) => (
          <React.Fragment key={`header-${i}`}>
            <div className="bg-[#E5E9F2]" />
            <div className="px-7 py-4">
              <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {paginated.length > 0 && (
        <>
          {paginated.map((u, i) => {
            const showResetButton = u.role === "Counselor" && u.status === "Rejected";

            return (
              <div
                key={u._id}
                className="grid border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#FAFBFE] transition-colors"
                style={{ gridTemplateColumns: columns }}
              >
                <div className="px-5 py-4 flex items-center">
                  <span className="text-[14px] font-medium text-[#9CA3AF]">
                    {(page - 1) * ROWS_PER_PAGE + i + 1}
                  </span>
                </div>

                <div className="self-stretch bg-[#E5E9F2]" />
                <div className="px-7 py-4 flex items-center gap-3 overflow-hidden">
                  <img
                    src={getProfilePhotoUrl(u)}
                    alt={u.name}
                    className="rounded-full border-2 border-[#E5E7EB] flex-shrink-0"
                    style={{ width: 38, height: 38, objectFit: "cover" }}
                  />
                  <p className="text-[15px] font-semibold text-[#111827] truncate">{u.name}</p>
                </div>

                <div className="self-stretch bg-[#E5E9F2]" />
                <div className="px-7 py-4 flex items-center overflow-hidden">
                  <p className="text-[14px] font-medium text-[#374151] truncate">{u.email}</p>
                </div>

                <div className="self-stretch bg-[#E5E9F2]" />
                <div className="px-7 py-4 flex items-center">{getStatusBadge(u)}</div>

                <div className="self-stretch bg-[#E5E9F2]" />
                <div className="px-7 py-4 flex items-center">{getRoleBadge(u)}</div>

                <div className="self-stretch bg-[#E5E9F2]" />
                <div className="px-7 py-4 flex items-center">
                  <p className="text-[14px] font-medium text-[#374151] whitespace-nowrap">{formatDate(u.createdAt)}</p>
                </div>

                <div className="self-stretch bg-[#E5E9F2]" />
                <div className="px-7 py-4 flex items-center gap-2">
                  {showResetButton && (
                    <button
                      onClick={() => onResetToPending(u._id)}
                      className="px-4 py-2 text-[12px] font-semibold text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FDE68A] transition-colors whitespace-nowrap"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(u._id)}
                    className="px-4 py-2 text-[12px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FECACA] transition-colors whitespace-nowrap"
                  >
                    Remove Account
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {paginated.length === 0 && (
        <div className="py-32 flex items-center justify-center">
          <p className="text-[15px] font-medium text-[#9CA3AF]">No users found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filtered.length}
          itemsPerPage={ROWS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default UsersTable;