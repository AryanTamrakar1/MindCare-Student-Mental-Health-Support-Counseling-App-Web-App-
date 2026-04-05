import React from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/counselorDirectory/SearchBar";
import FilterSection from "../components/counselorDirectory/FilterSection";
import CounselorCard from "../components/CounselorDirectory/CounselorCard";
import Pagination from "../components/CounselorDirectory/Pagination";
import { CounselorDirectoryProvider } from "../context/counselorDirectory/CounselorDirectoryContext";
import { useCounselorDirectory } from "../hooks/counselorDirectory/useCounselorDirectory";

const CounselorDirectoryInner = () => {
  const navigate = useNavigate();
  const {
    user,
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
  } = useCounselorDirectory();

  if (!user) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF]"
    >
      <Navbar />
      <StudentSidebar user={user} />
      <main className="ml-[260px] pt-[72px]">
        <div className="px-7 py-7">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            onClear={handleSearchClear}
            filterSlot={
              <FilterSection
                availableTags={availableTags}
                filterRating={filterRating}
                filterStudents={filterStudents}
                filterAvailability={filterAvailability}
                filterSpecialty={filterSpecialty}
                filterStatus={filterStatus}
                onApply={handleApply}
                onClear={handleClear}
              />
            }
          />

          {currentCards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
              <p className="text-[16px] text-[#9CA3AF]">
                No counselors match your criteria.
              </p>
              <button
                onClick={() => {
                  handleClear();
                  handleSearchClear();
                }}
                className="mt-3 text-[14px] text-[#2563EB] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {currentCards.map((cslr) => (
                <CounselorCard
                  key={cslr._id}
                  cslr={cslr}
                  stats={
                    counselorStats[cslr._id] || {
                      overall: 0,
                      studentsHelped: 0,
                    }
                  }
                  liveStatuses={liveStatuses}
                  expandedCards={expandedCards}
                  onToggleCardTags={toggleCardTags}
                  onViewProfile={(id) => navigate(`/counselor/${id}`)}
                />
              ))}
            </div>
          )}

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

const CounselorDirectory = () => {
  return (
    <CounselorDirectoryProvider>
      <CounselorDirectoryInner />
    </CounselorDirectoryProvider>
  );
};

export default CounselorDirectory;
