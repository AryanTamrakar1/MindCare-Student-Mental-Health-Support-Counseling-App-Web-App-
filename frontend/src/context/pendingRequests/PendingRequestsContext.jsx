import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";

const PendingRequestsContext = createContext(null);

export const PendingRequestsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(function () {
    const initializePage = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          return;
        }
        if (!user) {
          const userRes = await axios.get("/auth/me", {
            headers: { Authorization: "Bearer " + token },
          });
          setUser(userRes.data);
        }
        await fetchRequests();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initializePage();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/appointments/pending", {
        headers: { Authorization: "Bearer " + token },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleAction = async (appointmentId, status) => {
    try {
      const token = sessionStorage.getItem("token");
      if (status === "Approved") {
        await axios.post(
          "/sessions/approve",
          { appointmentId },
          { headers: { Authorization: "Bearer " + token } }
        );
      } else {
        await axios.put(
          "/appointments/update-status",
          { appointmentId, status },
          { headers: { Authorization: "Bearer " + token } }
        );
      }
      alert("Session " + status + " successfully!");
      const updated = [];
      for (let i = 0; i < requests.length; i++) {
        if (requests[i]._id !== appointmentId) {
          updated.push(requests[i]);
        }
      }
      setRequests(updated);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update status");
    }
  };

  return (
    <PendingRequestsContext.Provider
      value={{
        user,
        requests,
        expandedId,
        setExpandedId,
        handleAction,
      }}
    >
      {children}
    </PendingRequestsContext.Provider>
  );
};

export const usePendingRequestsContext = () => {
  const ctx = useContext(PendingRequestsContext);
  if (!ctx)
    throw new Error(
      "usePendingRequestsContext must be used inside PendingRequestsProvider"
    );
  return ctx;
};