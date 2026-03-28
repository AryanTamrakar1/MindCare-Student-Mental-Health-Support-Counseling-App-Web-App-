import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";

const CounselorDirectoryContext = createContext(null);

export const CounselorDirectoryProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [displayCounselors, setDisplayCounselors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [liveStatuses, setLiveStatuses] = useState({});
  const [counselorStats, setCounselorStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const [filterRating, setFilterRating] = useState("All Rating");
  const [filterStudents, setFilterStudents] = useState("All Students");
  const [filterAvailability, setFilterAvailability] = useState("Any");
  const [filterSpecialty, setFilterSpecialty] = useState("Any");
  const [filterStatus, setFilterStatus] = useState("Any");

  const cardsPerPage = 6;

  useEffect(() => {
    if (!dataLoaded) {
      loadPage();
      setDataLoaded(true);
    }
  }, []);

  const loadPage = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userRes = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);
      await loadCounselors();
    } catch (err) {
      console.error(err);
    }
  };

  const loadCounselors = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/auth/counselors");
      const data = res.data;
      setCounselors(data);
      setDisplayCounselors(data);

      const tags = [];
      for (let i = 0; i < data.length; i++) {
        const c = data[i];
        if (c.specialization) {
          const parts = c.specialization.split(",");
          for (let j = 0; j < parts.length; j++) {
            const clean = parts[j].trim();
            if (clean && !tags.includes(clean)) tags.push(clean);
          }
        }
        loadStatus(c._id);
      }
      setAvailableTags(tags);

      const statsMap = {};
      for (let i = 0; i < data.length; i++) {
        const c = data[i];
        let overall = 0;
        let totalRatings = 0;
        let studentsHelped = 0;

        try {
          const ratingRes = await axios.get(`/ratings/counselor/${c._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          overall = ratingRes.data.overall || 0;
          totalRatings = ratingRes.data.totalRatings || 0;
        } catch (err) {
          console.error("Error fetching rating for", c._id, err);
        }

        try {
          const countRes = await axios.get(
            `/appointments/completed-count/${c._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          studentsHelped = countRes.data.count || 0;
        } catch (err) {
          console.error("Error fetching count for", c._id, err);
        }

        statsMap[c._id] = { overall, totalRatings, studentsHelped };
      }

      setCounselorStats(statsMap);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStatus = async (counselorId) => {
    try {
      const res = await axios.get(`/appointments/live-status/${counselorId}`);
      setLiveStatuses((prev) => ({ ...prev, [counselorId]: res.data }));
    } catch {}
  };

  useEffect(() => {
    if (counselors.length === 0) return;
    const interval = setInterval(() => {
      for (let i = 0; i < counselors.length; i++) {
        loadStatus(counselors[i]._id);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [counselors]);

  const sortCounselors = (counselorList) => {
    const sorted = [];
    for (let i = 0; i < counselorList.length; i++) {
      sorted.push(counselorList[i]);
    }
    sorted.sort((c1, c2) => {
      const stats1 = counselorStats[c1._id] || { overall: 0, studentsHelped: 0 };
      const stats2 = counselorStats[c2._id] || { overall: 0, studentsHelped: 0 };
      const status1 = liveStatuses[c1._id] ? liveStatuses[c1._id].label : "Available";
      const status2 = liveStatuses[c2._id] ? liveStatuses[c2._id].label : "Available";

      const isAvailable1 = status1 === "Available" ? 1 : 0;
      const isAvailable2 = status2 === "Available" ? 1 : 0;
      if (isAvailable1 !== isAvailable2) return isAvailable2 - isAvailable1;
      if (stats1.overall !== stats2.overall) return stats2.overall - stats1.overall;
      return stats2.studentsHelped - stats1.studentsHelped;
    });
    return sorted;
  };

  const runFilter = (term, rating, students, availability, specialty, status) => {
    setCurrentPage(1);
    const results = [];
    for (let i = 0; i < counselors.length; i++) {
      const c = counselors[i];
      const stats = counselorStats[c._id] || { overall: 0, studentsHelped: 0 };
      const statusInfo = liveStatuses[c._id];
      const statusLabel = statusInfo ? statusInfo.label : "Available";

      let matchesSearch = true;
      if (term) {
        const lower = term.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(lower);
        const specMatch = c.specialization && c.specialization.toLowerCase().includes(lower);
        if (!nameMatch && !specMatch) matchesSearch = false;
      }

      let matchesRating = true;
      if (rating === "5.0") matchesRating = stats.overall === 5.0;
      else if (rating === "4.0+") matchesRating = stats.overall >= 4.0 && stats.overall < 5.0;
      else if (rating === "3.0+") matchesRating = stats.overall >= 3.0 && stats.overall < 4.0;
      else if (rating === "2.0+") matchesRating = stats.overall >= 2.0 && stats.overall < 3.0;
      else if (rating === "1.0+") matchesRating = stats.overall >= 1.0 && stats.overall < 2.0;

      let matchesStudents = true;
      if (students === "30+") matchesStudents = stats.studentsHelped >= 30;
      else if (students === "25+") matchesStudents = stats.studentsHelped >= 25;
      else if (students === "20+") matchesStudents = stats.studentsHelped >= 20;
      else if (students === "15+") matchesStudents = stats.studentsHelped >= 15;
      else if (students === "10+") matchesStudents = stats.studentsHelped >= 10;
      else if (students === "5+") matchesStudents = stats.studentsHelped >= 5;

      let matchesAvailability = true;
      if (availability !== "Any") {
        const days = [];
        if (c.availability) {
          for (let j = 0; j < c.availability.length; j++) {
            days.push(c.availability[j].day);
          }
        }
        matchesAvailability = days.includes(availability);
      }

      let matchesSpecialty = true;
      if (specialty !== "Any") {
        if (!c.specialization) {
          matchesSpecialty = false;
        } else {
          const parts = c.specialization.split(",");
          let found = false;
          for (let j = 0; j < parts.length; j++) {
            if (parts[j].trim() === specialty) {
              found = true;
              break;
            }
          }
          matchesSpecialty = found;
        }
      }

      let matchesStatus = true;
      if (status !== "Any") matchesStatus = statusLabel === status;

      if (
        matchesSearch &&
        matchesRating &&
        matchesStudents &&
        matchesAvailability &&
        matchesSpecialty &&
        matchesStatus
      ) {
        results.push(c);
      }
    }
    const sorted = sortCounselors(results);
    setDisplayCounselors(sorted);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    runFilter(term, filterRating, filterStudents, filterAvailability, filterSpecialty, filterStatus);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    runFilter("", filterRating, filterStudents, filterAvailability, filterSpecialty, filterStatus);
  };

  const handleApply = (pending) => {
    setFilterRating(pending.rating);
    setFilterStudents(pending.students);
    setFilterAvailability(pending.availability);
    setFilterSpecialty(pending.specialty);
    setFilterStatus(pending.status);
    runFilter(searchTerm, pending.rating, pending.students, pending.availability, pending.specialty, pending.status);
  };

  const handleClear = () => {
    setFilterRating("All Rating");
    setFilterStudents("All Students");
    setFilterAvailability("Any");
    setFilterSpecialty("Any");
    setFilterStatus("Any");
    runFilter(searchTerm, "All Rating", "All Students", "Any", "Any", "Any");
  };

  const toggleCardTags = (id) =>
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalPages = Math.ceil(displayCounselors.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = [];
  for (let i = startIndex; i < startIndex + cardsPerPage; i++) {
    if (i < displayCounselors.length) {
      currentCards.push(displayCounselors[i]);
    }
  }

  return (
    <CounselorDirectoryContext.Provider
      value={{
        user,
        counselors,
        displayCounselors,
        searchTerm,
        setSearchTerm,
        availableTags,
        liveStatuses,
        counselorStats,
        currentPage,
        setCurrentPage,
        expandedCards,
        filterRating,
        filterStudents,
        filterAvailability,
        filterSpecialty,
        filterStatus,
        handleSearch,
        handleSearchClear,
        handleApply,
        handleClear,
        toggleCardTags,
        totalPages,
        currentCards,
      }}
    >
      {children}
    </CounselorDirectoryContext.Provider>
  );
};

export const useCounselorDirectoryContext = () => {
  const ctx = useContext(CounselorDirectoryContext);
  if (!ctx)
    throw new Error(
      "useCounselorDirectoryContext must be used inside CounselorDirectoryProvider"
    );
  return ctx;
};