import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import RequestCard from "../components/pendingRequests/RequestCard";

const PendingRequests = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAction = async (appointmentId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      if (status === "Approved") {
        await axios.post(
          "/sessions/approve",
          { appointmentId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.put(
          "/appointments/update-status",
          { appointmentId, status },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      alert(`Session ${status} successfully!`);
      fetchRequests();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <CounselorSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Requests...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CounselorSidebar user={user} />
      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
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
          <Navbar />
        </div>

        <div className="flex flex-col gap-4 w-full">
          {requests.length > 0 ? (
            requests.map((req) => (
              <RequestCard key={req._id} req={req} onAction={handleAction} />
            ))
          ) : (
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
  );
};

export default PendingRequests;
