import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";

const CounselorDirectory = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [counselors, setCounselors] = useState([]);

  const [displayCounselors, setDisplayCounselors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSpecialties, setSelectedSpecialties] = useState(["All"]);

  const [availableTags, setAvailableTags] = useState([]);

  const [liveStatuses, setLiveStatuses] = useState({});

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = 6;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // It runs when the page opens to load user data and counselor list
  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        if (!user) {
          const token = sessionStorage.getItem("token");
          if (token) {
            const userRes = await axios.get("/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(userRes.data);
          }
        }
        await fetchCounselors();
      } catch (err) {
        console.error("Initialization error", err);
        setLoading(false);
      }
    };
    initializePage();
  }, []);

  // It gets all counselors from the database and extracts unique tags for filtering
  const fetchCounselors = async () => {
    try {
      const response = await axios.get("/auth/counselors");
      const data = response.data;
      setCounselors(data);
      setDisplayCounselors(data);
      let tags = ["All"];
      for (let i = 0; i < data.length; i++) {
        const cslr = data[i];
        if (cslr.specialization) {
          const splitSpecs = cslr.specialization.split(",");
          for (let j = 0; j < splitSpecs.length; j++) {
            const cleanTag = splitSpecs[j].trim();
            if (!tags.includes(cleanTag) && cleanTag !== "") {
              tags.push(cleanTag);
            }
          }
        }
        fetchStatus(cslr._id);
      }
      setAvailableTags(tags);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching counselors:", error);
      setLoading(false);
    }
  };

  // It checks if a counselor is busy or not
  const fetchStatus = async (id) => {
    try {
      const res = await axios.get(`/appointments/live-status/${id}`);
      setLiveStatuses((prev) => {
        const newStatuses = { ...prev };
        newStatuses[id] = res.data;
        return newStatuses;
      });
    } catch (err) {
      console.error("Status error", err);
    }
  };

  // It adds or removes a specialty tag when the user clicks it
  const handleToggleTag = (tag) => {
    if (tag === "All") {
      setSelectedSpecialties(["All"]);
    } else {
      let newSelection = [];
      for (let i = 0; i < selectedSpecialties.length; i++) {
        if (selectedSpecialties[i] !== "All") {
          newSelection.push(selectedSpecialties[i]);
        }
      }
      if (newSelection.includes(tag)) {
        const index = newSelection.indexOf(tag);
        newSelection.splice(index, 1);
      } else {
        newSelection.push(tag);
      }
      if (newSelection.length === 0) {
        setSelectedSpecialties(["All"]);
      } else {
        setSelectedSpecialties(newSelection);
      }
    }
  };

  // It filters the list based on the search text and selected tags
  const handleApplyFilter = () => {
    setCurrentPage(1);
    let filteredResults = [];
    for (let i = 0; i < counselors.length; i++) {
      const c = counselors[i];
      let matchesSearch = true;
      let matchesTag = true;
      if (searchTerm !== "") {
        const lowerSearch = searchTerm.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(lowerSearch);
        const specMatch =
          c.specialization &&
          c.specialization.toLowerCase().includes(lowerSearch);
        if (!nameMatch && !specMatch) matchesSearch = false;
      }
      if (!selectedSpecialties.includes("All")) {
        matchesTag = false;
        const counselorSpecs = c.specialization
          ? c.specialization.split(",")
          : [];
        for (let j = 0; j < selectedSpecialties.length; j++) {
          for (let k = 0; k < counselorSpecs.length; k++) {
            if (counselorSpecs[k].trim() === selectedSpecialties[j]) {
              matchesTag = true;
              break;
            }
          }
        }
      }
      if (matchesSearch && matchesTag) filteredResults.push(c);
    }
    setDisplayCounselors(filteredResults);
  };

  // It clears all filters
  const handleClear = () => {
    setSelectedSpecialties(["All"]);
    setSearchTerm("");
    setDisplayCounselors(counselors);
    setCurrentPage(1);
  };

  // It handles pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = displayCounselors.slice(
    indexOfFirstCard,
    indexOfLastCard,
  );
  const totalPages = Math.ceil(displayCounselors.length / cardsPerPage);

  //It chooses the color for the status label based on the counselor's availability status
  const getStatusStyles = (id) => {
    const info = liveStatuses[id] || { status: "Green", label: "Available" };
    if (info.status === "Yellow")
      return "bg-amber-50 text-amber-600 border-amber-100";
    if (info.status === "Red")
      return "bg-rose-50 text-rose-600 border-rose-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  // It helps to render the counselor directory page.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <Navbar user={user} />
        <div className="flex">
          <StudentSidebar user={user} />
          <main className="flex-1 p-10 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Loading Directory...
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar user={user} />
      <div className="flex">
        <StudentSidebar user={user} />
        <main className="flex-1 p-10">
          {/* It is the title and description section */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800">
              Find Your Counselor
            </h2>
            <p className="text-gray-500">
              Connect with professionals specialized in student well-being.
            </p>
          </div>

          {/* It is the search bar section */}
          <section className="mb-6">
            <div className="flex bg-white p-2 rounded-[15px] border border-gray-200 shadow-sm overflow-hidden">
              <input
                type="text"
                placeholder="Search by name or keyword..."
                className="flex-1 p-3 outline-none text-sm text-gray-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleApplyFilter}
                className="bg-[#4f46e5] text-white px-8 py-2 rounded-[10px] font-bold hover:bg-[#3730a3] transition duration-200"
              >
                Search
              </button>
            </div>
          </section>

          {/* It is the specialization filter sections */}
          <section className="bg-white p-6 rounded-[15px] border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Filter by Specialization:
                </p>
                {!selectedSpecialties.includes("All") && (
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                    {selectedSpecialties.length} Selected
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="text-[12px] font-bold bg-[#4f46e5] text-white px-5 py-2 rounded-xl hover:bg-[#3730a3] transition shadow-md"
                  onClick={handleApplyFilter}
                >
                  Apply Filter
                </button>
                <button
                  className="text-[12px] font-bold bg-gray-100 text-gray-500 px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                  onClick={handleClear}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {availableTags.map((spec) => {
                const isSelected = selectedSpecialties.includes(spec);
                return (
                  <button
                    key={spec}
                    onClick={() => handleToggleTag(spec)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${isSelected ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400"}`}
                  >
                    {isSelected && <span>✓</span>}
                    {spec}
                  </button>
                );
              })}
            </div>
          </section>

          {/* It is the counselors grid section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.length > 0 ? (
              currentCards.map((cslr) => {
                const availableDays = [];
                if (cslr.availability) {
                  for (let d = 0; d < cslr.availability.length; d++) {
                    availableDays.push(cslr.availability[d].day);
                  }
                }
                const statusInfo = liveStatuses[cslr._id] || {
                  status: "Green",
                  label: "Available",
                };
                return (
                  <div
                    key={cslr._id}
                    className="bg-white rounded-[24px] p-7 border border-gray-100 shadow-sm transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center font-bold text-2xl flex-shrink-0 border border-indigo-100">
                            {cslr.name ? cslr.name.charAt(0) : "C"}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">
                              {cslr.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-400">
                              {cslr.profTitle || "Clinical Counselor"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border transition-colors duration-500 ${getStatusStyles(cslr._id)}`}
                        >
                          ● {statusInfo.label}
                        </span>
                      </div>

                      {/* It is the specialization section within the counselor grid */}
                      <div className="flex flex-wrap gap-2 mb-4 h-[75px] overflow-y-auto pr-1 custom-scrollbar">
                        {cslr.specialization &&
                        cslr.specialization.trim() !== "" ? (
                          cslr.specialization.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-50 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-tight h-fit"
                            >
                              {tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-100 h-fit">
                            GENERAL
                          </span>
                        )}
                      </div>

                      {/* It is the ratings & student helped section within the counselor grid */}
                      <div className="grid grid-cols-2 border-y border-gray-100 py-5 mb-6">
                        <div className="flex flex-col items-center justify-center border-r border-gray-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-lg">⭐</span>
                            <span className="text-xl font-black text-gray-800">
                              {cslr.rating ? cslr.rating.toFixed(1) : "0.0"}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Rating
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-lg">🤝</span>
                            <span className="text-xl font-black text-gray-800">
                              {cslr.studentsHelped || 0}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                            Students Helped
                          </span>
                        </div>
                      </div>

                      {/* It is the weekly availability section within the counselor grid */}
                      <div className="space-y-4 mb-8">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Weekly Availability
                          </p>
                          <div className="flex justify-between gap-1">
                            {daysOfWeek.map((day) => {
                              const isActive = availableDays.includes(day);
                              return (
                                <div
                                  key={day}
                                  className={`flex-1 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${isActive ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-50 text-gray-300 border border-gray-100"}`}
                                >
                                  {day.charAt(0)}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/counselor/${cslr._id}`)}
                      className="w-full py-4 bg-white border border-gray-200 rounded-[18px] font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 shadow-sm"
                    >
                      View Profile
                    </button>
                  </div>
                );
              })
            ) : (
              // It shows this message if no counselor is found during search
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
        </main>
      </div>
    </div>
  );
};

export default CounselorDirectory;
