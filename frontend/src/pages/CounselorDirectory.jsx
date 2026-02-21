import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/counselorDirectory/SearchBar";
import FilterSection from "../components/counselorDirectory/FilterSection";
import CounselorCard from "../components/counselorDirectory/CounselorCard";
import Pagination from "../components/counselorDirectory/Pagination";

const CounselorDirectory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [displayCounselors, setDisplayCounselors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState(["All"]);
  const [availableTags, setAvailableTags] = useState([]);
  const [liveStatuses, setLiveStatuses] = useState({});
  const [counselorStats, setCounselorStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});

  const cardsPerPage = 2;

  useEffect(() => {
    loadPage();
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
      setLoading(false);
    }
  };

  const loadCounselors = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/auth/counselors");
      const data = res.data;

      setCounselors(data);
      setDisplayCounselors(data);

      const tags = ["All"];
      data.forEach((c) => {
        if (c.specialization) {
          c.specialization.split(",").forEach((tag) => {
            const clean = tag.trim();
            if (clean && !tags.includes(clean)) {
              tags.push(clean);
            }
          });
        }
        loadStatus(c._id);
      });
      setAvailableTags(tags);

      const statsMap = {};
      for (const c of data) {
        let overall = 0;
        let totalRatings = 0;
        let studentsHelped = 0;

        try {
          const ratingRes = await axios.get(`/ratings/counselor/${c._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          overall = ratingRes.data.overall || 0;
          totalRatings = ratingRes.data.totalRatings || 0;
        } catch {}

        try {
          const countRes = await axios.get(
            `/appointments/completed-count/${c._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          studentsHelped = countRes.data.count || 0;
        } catch {}

        statsMap[c._id] = { overall, totalRatings, studentsHelped };
      }
      setCounselorStats(statsMap);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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
      counselors.forEach((c) => loadStatus(c._id));
    }, 60000);
    return () => clearInterval(interval);
  }, [counselors]);

  const handleToggleTag = (tag) => {
    if (tag === "All") {
      setSelectedSpecialties(["All"]);
      return;
    }
    let newList = selectedSpecialties.filter((t) => t !== "All");
    if (newList.includes(tag)) {
      newList = newList.filter((t) => t !== tag);
    } else {
      newList = [...newList, tag];
    }
    setSelectedSpecialties(newList.length === 0 ? ["All"] : newList);
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    const results = counselors.filter((c) => {
      const matchesSearch =
        !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.specialization &&
          c.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

      const allSelected = selectedSpecialties.includes("All");
      const matchesTag =
        allSelected ||
        selectedSpecialties.some(
          (spec) =>
            c.specialization &&
            c.specialization
              .split(",")
              .map((s) => s.trim())
              .includes(spec),
        );

      return matchesSearch && matchesTag;
    });
    setDisplayCounselors(results);
  };

  const handleClear = () => {
    setSelectedSpecialties(["All"]);
    setSearchTerm("");
    setDisplayCounselors(counselors);
    setCurrentPage(1);
  };

  const toggleCardTags = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPages = Math.ceil(displayCounselors.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = displayCounselors.slice(
    startIndex,
    startIndex + cardsPerPage,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Directory...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <StudentSidebar user={user} />
      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Find Your Counselor
            </h2>
            <p className="text-gray-500">
              Connect with professionals specialized in student well-being.
            </p>
          </div>
          <Navbar />
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleApplyFilter}
        />

        <FilterSection
          availableTags={availableTags}
          selectedSpecialties={selectedSpecialties}
          onToggleTag={handleToggleTag}
          onApplyFilter={handleApplyFilter}
          onClear={handleClear}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {currentCards.length > 0 ? (
            currentCards.map((cslr) => (
              <CounselorCard
                key={cslr._id}
                cslr={cslr}
                stats={
                  counselorStats[cslr._id] || { overall: 0, studentsHelped: 0 }
                }
                liveStatuses={liveStatuses}
                expandedCards={expandedCards}
                onToggleCardTags={toggleCardTags}
                onViewProfile={(id) => navigate(`/counselor/${id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold text-lg">
                No counselors match your criteria.
              </p>
              <button
                onClick={handleClear}
                className="text-indigo-600 font-black text-xs uppercase mt-4 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default CounselorDirectory;
