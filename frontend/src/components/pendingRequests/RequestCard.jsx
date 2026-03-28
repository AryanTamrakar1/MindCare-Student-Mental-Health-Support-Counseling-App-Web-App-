function parseTags(reason) {
  if (!reason) return [];
  if (reason.indexOf("]") === -1) return [];
  const start = reason.indexOf("[");
  const end = reason.indexOf("]");
  if (start === -1 || end === -1) return [];
  const tagString = reason.substring(start + 1, end);
  const rawTags = tagString.split(",");
  const tags = [];
  for (let i = 0; i < rawTags.length; i++) {
    const trimmed = rawTags[i].trim();
    if (trimmed) tags.push(trimmed);
  }
  return tags;
}

function parseReasonText(reason) {
  if (!reason) return "";
  if (reason.indexOf("]") === -1) return reason;
  const end = reason.indexOf("]");
  return reason.substring(end + 1).trim();
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const suffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  return `${day}${suffix(day)} ${month} ${year}`;
}

function getStudentPhotoUrl(studentId) {
  if (studentId && studentId.verificationPhoto) {
    return "http://127.0.0.1:5050/uploads/verifications/" + studentId.verificationPhoto;
  }
  let name = "Student";
  if (studentId && studentId.name) {
    name = studentId.name;
  }
  return "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=2563EB&color=fff&size=200";
}

const RequestCard = ({ req, onAction, expanded, onToggle }) => {
  const allTags = parseTags(req.reason);
  const reasonText = parseReasonText(req.reason);

  let studentName = "Unknown Student";
  if (req.studentId && req.studentId.name) {
    studentName = req.studentId.name;
  }

  const visibleTags = allTags.slice(0, 2);

  let extraCount = 0;
  if (allTags.length > 2) extraCount = allTags.length - 2;

  let toggleArrow = "▼";
  if (expanded) toggleArrow = "▲";

  return (
    <div
      className="border-b border-[#E5E9F2] last:border-b-0"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="grid items-center hover:bg-[#FAFBFE] transition-colors"
        style={{ gridTemplateColumns: "2.5fr 1px 1.5fr 1px 1.5fr 1px 1.6fr" }}
      >
        <div className="flex items-center gap-4 px-8 py-6">
          <img
            src={getStudentPhotoUrl(req.studentId)}
            alt={studentName}
            className="border-2 border-[#E5E7EB] flex-shrink-0"
            style={{ width: 52, height: 52, objectFit: "cover", borderRadius: "50%" }}
          />
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-[#111827] truncate">
              {studentName}
            </p>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {allTags.length === 0 && (
                <span className="bg-[#EEF2FF] text-[#2563EB] px-2.5 py-1 text-[12px] font-semibold">
                  General
                </span>
              )}
              {allTags.length > 0 && visibleTags.map((tag, i) => (
                <span key={i} className="bg-[#EEF2FF] text-[#2563EB] px-2.5 py-1 text-[12px] font-semibold">
                  {tag}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="bg-[#E5E7EB] text-[#6B7280] px-2.5 py-1 text-[12px] font-semibold">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="px-8 py-6">
          <span className="text-[16px] font-medium text-[#374151]">
            {formatDate(req.date)}
          </span>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="px-8 py-6">
          <span className="text-[16px] font-medium text-[#374151]">
            {req.timeSlot}
          </span>
        </div>

        <div className="self-stretch bg-[#E5E9F2]" />

        <div className="px-8 py-6 flex items-center gap-3">
          <button
            onClick={() => onAction(req._id, "Approved")}
            className="px-5 py-2.5 text-[14px] font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
          >
            Approve
          </button>

          <button
            onClick={() => onAction(req._id, "Declined")}
            className="px-5 py-2.5 text-[14px] font-semibold text-[#DC2626] bg-white border border-[#FCA5A5] hover:bg-[#FEF2F2] transition-colors"
          >
            Decline
          </button>

          <button
            onClick={onToggle}
            className="px-3 py-2.5 text-[14px] font-semibold text-[#6B7280] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors"
          >
            {toggleArrow}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E5E9F2] px-10 py-7 bg-[#FAFBFE]">
          {allTags.length > 0 && (
            <div className="mb-5">
              <p className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Specializations
              </p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, i) => (
                  <span key={i} className="bg-[#EEF2FF] text-[#2563EB] px-3.5 py-1.5 text-[13px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
              Full Reason
            </p>
            <div className="bg-white border border-[#E5E9F2] px-6 py-5">
              <p className="text-[16px] text-[#374151] leading-relaxed">
                {reasonText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;