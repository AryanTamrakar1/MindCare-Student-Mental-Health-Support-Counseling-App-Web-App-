import { useState } from "react";

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
    if (trimmed) {
      tags.push(trimmed);
    }
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
  return `${day}${suffix(day)} ${month} ${year}`;
}

const RequestCard = ({ req, onAction }) => {
  const [expanded, setExpanded] = useState(false);

  const allTags = parseTags(req.reason);
  const reasonText = parseReasonText(req.reason);

  let studentInitial = "S";
  if (req.studentId && req.studentId.name && req.studentId.name.length > 0) {
    studentInitial = req.studentId.name.charAt(0);
  }

  let studentName = "Unknown Student";
  if (req.studentId && req.studentId.name) {
    studentName = req.studentId.name;
  }

  const visibleTags = [];
  for (let i = 0; i < allTags.length && i < 2; i++) {
    visibleTags.push(allTags[i]);
  }
  const extraCount = allTags.length > 2 ? allTags.length - 2 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-shadow w-full">
      <div className="flex flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-5 w-1/4">
          <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
            {studentInitial}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-black text-lg truncate">
              {studentName}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1 items-center">
              {allTags.length > 0 ? (
                <>
                  {visibleTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="text-[9px] font-black text-slate-400 ml-1">
                      +{extraCount} more
                    </span>
                  )}
                </>
              ) : (
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-indigo-200">
                  General
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-around items-center border-l-2 border-r-2 border-slate-300 px-10">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Date of Session
            </span>
            <span className="font-bold text-black text-base">
              {formatDate(req.date)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Time Slot
            </span>
            <span className="font-bold text-black text-base">
              {req.timeSlot}
            </span>
          </div>
        </div>

        <div className="w-1/4 text-right">
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-slate-50 text-indigo-700 border border-slate-300 px-8 py-3 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
          >
            {expanded ? "CLOSE" : "VIEW DETAILS"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t-2 border-slate-300">
          {allTags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Selected Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
              Reason for Session (Detailed)
            </h4>
            <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
              {reasonText}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onAction(req._id, "Declined")}
              className="px-8 py-3 rounded-xl font-bold text-xs text-red-600 border border-red-300 hover:bg-red-50 transition-all uppercase"
            >
              Decline
            </button>
            <button
              onClick={() => onAction(req._id, "Approved")}
              className="px-12 py-3 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all uppercase"
            >
              Approve Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
