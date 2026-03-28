import React from "react";

const ApplicantTable = ({ pendingUsers, onViewApplication }) => {
  const columns = "50px 1px 2.5fr 1px 1.5fr 1px 1.2fr 1px 1.4fr";

  let tableContent;
  if (pendingUsers.length === 0) {
    tableContent = (
      <div className="py-32 flex items-center justify-center">
        <p className="text-[15px] font-medium text-[#9CA3AF]">
          No pending applications.
        </p>
      </div>
    );
  } else {
    tableContent = pendingUsers.map((u, i) => (
      <div
        key={u._id}
        className="grid border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#FAFBFE] transition-colors"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="px-5 py-5 flex items-center">
          <span className="text-[14px] font-medium text-[#9CA3AF]">
            {i + 1}
          </span>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />
        <div className="px-7 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EEF2FF] text-[#2563EB] flex items-center justify-center font-bold text-[15px] flex-shrink-0 rounded-full">
            {u.name.charAt(0)}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#111827]">
              {u.name}
            </p>
            <p className="text-[13px] text-[#9CA3AF]">{u.email}</p>
          </div>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />
        <div className="px-7 py-5 flex items-center">
          <span className="px-3 py-1 text-[11px] font-semibold bg-[#EEF2FF] text-[#2563EB] border border-[#C7D2FE]">
            {u.specialization || "General"}
          </span>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />
        <div className="px-7 py-5 flex items-center">
          <span className="px-3 py-1 text-[11px] font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
            Pending Review
          </span>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />
        <div className="px-7 py-5 flex items-center">
          <button
            onClick={() => onViewApplication(u)}
            className="px-4 py-2 text-[13px] font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
          >
            View Application
          </button>
        </div>
      </div>
    ));
  }

  return (
    <div
      className="bg-white border border-[#E5E9F2] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="grid border-b border-[#E5E9F2] bg-[#F9FAFB]"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="px-5 py-4 flex items-center">
          <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">
            #
          </span>
        </div>
        {[
          "Counselor Needing to be Approved",
          "Specialization",
          "Status",
          "Action",
        ].map((label, i) => (
          <React.Fragment key={`header-${i}`}>
            <div className="bg-[#E5E9F2]" />
            <div className="px-7 py-4">
              <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-widest">
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {tableContent}
    </div>
  );
};

export default ApplicantTable;