import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const CounselorApprovalsContext = createContext(null);

export const CounselorApprovalsProvider = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pending");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await API.put("/admin/update-status", {
        userId: id,
        status: newStatus,
      });
      alert(`Counselor has been ${newStatus}`);
      setSelectedUser(null);
      fetchPending();
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <CounselorApprovalsContext.Provider
      value={{
        pendingUsers,
        selectedUser,
        setSelectedUser,
        loading,
        handleAction,
      }}
    >
      {children}
    </CounselorApprovalsContext.Provider>
  );
};

export const useCounselorApprovalsContext = () => {
  const ctx = useContext(CounselorApprovalsContext);
  if (!ctx)
    throw new Error(
      "useCounselorApprovalsContext must be used inside CounselorApprovalsProvider"
    );
  return ctx;
};