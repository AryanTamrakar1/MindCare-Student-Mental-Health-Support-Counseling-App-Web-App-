import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const CounselorProfileViewContext = createContext(null);

export const CounselorProfileViewProvider = ({ children }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [counselor, setCounselor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveStatus, setLiveStatus] = useState(null);
  const [counselorStats, setCounselorStats] = useState({
    overall: 0,
    studentsHelped: 0,
    totalRatings: 0,
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!dataLoaded) {
      loadData();
      setDataLoaded(true);
    }
  }, [id, dataLoaded]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => loadLiveStatus(id), 60000);
    return () => clearInterval(interval);
  }, [id]);

  const loadData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const userRes = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const counselorRes = await axios.get("/auth/counselors");
      const found = counselorRes.data.find((c) => c._id === id);
      setCounselor(found);

      let overall = 0;
      let totalRatings = 0;
      let studentsHelped = 0;

      try {
        const ratingRes = await axios.get(`/ratings/counselor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        overall = ratingRes.data.overall || 0;
        totalRatings = ratingRes.data.totalRatings || 0;
      } catch {}

      try {
        const countRes = await axios.get(
          `/appointments/completed-count/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        studentsHelped = countRes.data.count || 0;
      } catch {}

      setCounselorStats({ overall, totalRatings, studentsHelped });
      loadLiveStatus(id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLiveStatus = async (counselorId) => {
    try {
      const res = await axios.get(`/appointments/live-status/${counselorId}`);
      setLiveStatus(res.data);
    } catch {}
  };

  const buildScheduleMap = () => {
    const map = {};
    const slots = counselor?.availability || [];
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!map[slot.day]) map[slot.day] = [];
      map[slot.day].push(slot.timeSlot);
    }
    return map;
  };

  const getTopics = () => {
    if (!counselor?.specialization) return [];
    const parts = counselor.specialization.split(",");
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      const clean = parts[i].trim();
      if (clean) result.push(clean);
    }
    return result;
  };

  const getQualifications = () => {
    if (!counselor?.qualifications) return [];
    const parts = counselor.qualifications.split(",");
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      const clean = parts[i].trim();
      if (clean) result.push(clean);
    }
    return result;
  };

  return (
    <CounselorProfileViewContext.Provider
      value={{
        id,
        user,
        counselor,
        isModalOpen,
        setIsModalOpen,
        liveStatus,
        counselorStats,
        buildScheduleMap,
        getTopics,
        getQualifications,
      }}
    >
      {children}
    </CounselorProfileViewContext.Provider>
  );
};

export const useCounselorProfileViewContext = () => {
  const ctx = useContext(CounselorProfileViewContext);
  if (!ctx)
    throw new Error(
      "useCounselorProfileViewContext must be used inside CounselorProfileViewProvider"
    );
  return ctx;
};