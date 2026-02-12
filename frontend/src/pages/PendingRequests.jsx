import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import CounselorSidebar from "../components/CounselorSidebar";
import Navbar from "../components/Navbar";

const PendingRequests = () => {
  const location = useLocation();

  const [user, setUser] = useState(location.state?.user || null);

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);

  // It checks if the user is logged in and loads the pending requests when page is open
  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        if (!user) {
          const userRes = await axios.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userRes.data);
        }
        await fetchRequests();
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  // It fetches the pending requests from the server
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/appointments/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  };

  // It formats the date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
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
  };

  // It updates the request stautus in the database
  const handleAction = async (appointmentId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `/appointments/update-status`,
        { appointmentId, status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(`Session ${status} successfully!`);
      fetchRequests();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update status");
    }
  };

  // It opens or closes the detail section of a request
  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // It helps to renders the pending requests page
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} />
        <div className="flex">
          <CounselorSidebar user={user} />
          <main className="flex-1 p-10 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Loading Requests...
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="flex">
        <CounselorSidebar user={user} />
        <main className="flex-1 p-10">
          {/* It is the title and description section */}
          <div className="mb-8 border-b-2 border-slate-300 pb-6">
            <h2 className="text-2xl font-black text-gray-800">
              Pending Session Requests
            </h2>
            <p className="text-gray-500">
              You have{" "}
              <span className="text-indigo-600 font-bold">
                {requests.length} new
              </span>{" "}
              requests waiting for your approval.
            </p>
          </div>

          {/* It is the pending requests details section */}
          <div className="flex flex-col gap-4 w-full">
            {requests.length > 0 ? (
              requests.map((req) => {
                const allTags = req.reason?.includes("]")
                  ? req.reason
                      .match(/\[(.*?)\]/)[1]
                      .split(",")
                      .map((t) => t.trim())
                  : [];

                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-shadow w-full"
                  >
                    {/* It is the student details section */}
                    <div className="flex flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-5 w-1/4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                          {req.studentId?.name
                            ? req.studentId.name.charAt(0)
                            : "S"}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-black text-lg truncate">
                            {req.studentId?.name || "Unknown Student"}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1 items-center">
                            {allTags.length > 0 ? (
                              <>
                                {allTags.slice(0, 2).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-indigo-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {allTags.length > 2 && (
                                  <span className="text-[9px] font-black text-slate-400 ml-1">
                                    +{allTags.length - 2} more
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

                      {/* It is the date and time section */}
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
                          onClick={() => toggleDetails(req._id)}
                          className="bg-slate-50 text-indigo-700 border border-slate-300 px-8 py-3 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          {expandedId === req._id ? "CLOSE" : "VIEW DETAILS"}
                        </button>
                      </div>
                    </div>

                    {/* It is the detailed section in pending requests page */}
                    {expandedId === req._id && (
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
                            {req.reason?.includes("]")
                              ? req.reason.split("]")[1].trim()
                              : req.reason}
                          </p>
                        </div>

                        {/* It is the buttons section to approve or decline a request in detailed section */}
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleAction(req._id, "Declined")}
                            className="px-8 py-3 rounded-xl font-bold text-xs text-red-600 border border-red-300 hover:bg-red-50 transition-all uppercase"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAction(req._id, "Approved")}
                            className="px-12 py-3 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all uppercase"
                          >
                            Approve Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // It is the empty state message shown when there are no pending requests in the pending requests page
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 py-32 px-10 flex flex-col items-center justify-center text-center w-full">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  No pending requests.
                </h3>
                <p className="text-slate-400 max-w-sm leading-relaxed font-medium text-sm">
                  The list is currently empty. You will be notified here when a
                  student requests a consultation.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PendingRequests;
