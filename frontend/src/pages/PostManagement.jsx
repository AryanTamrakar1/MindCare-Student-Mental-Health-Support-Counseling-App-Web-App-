import { useContext } from "react";
import { BookOpen } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/postManagement/PostCard";
import CategoryFilter from "../components/postManagement/CategoryFilter";
import PostSearchBar from "../components/postManagement/PostSearchBar";
import StatsCards from "../components/postManagement/StatsCards";
import Pagination from "../components/postManagement/Pagination";
import { PostManagementProvider } from "../context/postManagement/PostManagementContext";
import { usePostManagement } from "../hooks/postManagement/usePostManagement";

const forumRules = [
  {
    num: 1,
    title: "Be Kind & Respectful",
    desc: "Treat every member with empathy and understanding. This is a safe space — no judgment, no pressure.",
  },
  {
    num: 2,
    title: "Stay Anonymous",
    desc: "All posts are anonymous. Never share personal information that could identify yourself or others.",
  },
  {
    num: 3,
    title: "No Hate Speech",
    desc: "Personal attacks, discrimination, or hate speech will not be tolerated and will be removed.",
  },
  {
    num: 4,
    title: "Share Safely",
    desc: "Only share what you are comfortable with. You are never obligated to disclose more than you want.",
  },
  {
    num: 5,
    title: "Seek Professional Help",
    desc: "If you or someone else is in crisis, please reach out to a counselor through the MindCare platform.",
  },
  {
    num: 6,
    title: "No Spam or Self-Promotion",
    desc: "Do not post repetitive content, advertisements, or links unrelated to mental health support.",
  },
  {
    num: 7,
    title: "Support, Don't Diagnose",
    desc: "You can offer support and share experiences, but avoid diagnosing others or giving medical advice.",
  },
];

const PostManagementInner = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    selectedCategories,
    selectedMoods,
    sortBy,
    filterCounselorReplied,
    filterHasReplies,
    appliedCategories,
    appliedMoods,
    appliedSort,
    appliedCounselorReplied,
    appliedHasReplies,
    toggleCategory,
    toggleMood,
    setSortBy,
    setFilterCounselorReplied,
    setFilterHasReplies,
    handleApplyFilter,
    handleClearFilter,
    handleDeletePost,
    paginatedPosts,
    pageNumbers,
    totalPages,
    totalReplies,
    isFiltered,
    posts,
  } = usePostManagement();

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#EFF4FB",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <AdminSidebar user={user} />

      <div
        style={{
          position: "fixed",
          top: "72px",
          left: "260px",
          right: 0,
          bottom: 0,
          display: "grid",
          gridTemplateColumns: "280px minmax(500px, 1fr) 250px",
          gap: "20px",
          padding: "24px",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <div
          className="bg-white border border-[#E9F0FB]"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div className="px-6 py-5 border-b border-[#E9F0FB] flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-1">
              <BookOpen
                size={16}
                className="text-[#2563EB]"
                strokeWidth={2.5}
              />
              <p className="text-[16px] font-bold text-[#111827]">
                Forum Rules
              </p>
            </div>
            <p className="text-[13px] text-[#9CA3AF] font-medium">
              Please read carefully before posting
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {forumRules.map((rule, idx) => (
              <div
                key={rule.num}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px 24px",
                  alignItems: "center",
                }}
                className={
                  idx < forumRules.length - 1 ? "border-b border-[#F3F7FF]" : ""
                }
              >
                <div
                  className="bg-[#EEF2FF] flex items-center justify-center flex-shrink-0"
                  style={{ width: 36, height: 36 }}
                >
                  <span className="text-[14px] font-black text-[#2563EB]">
                    {rule.num}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#111827] mb-1.5">
                    {rule.title}
                  </p>
                  <p className="text-[12.5px] text-[#6B7280] leading-[1.65]">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            paddingRight: "4px",
          }}
        >
          <StatsCards totalPosts={posts.length} totalReplies={totalReplies} />

          <PostSearchBar
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            onClear={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            isFiltered={isFiltered}
          />

          {paginatedPosts.length === 0 ? (
            <div className="py-28 flex flex-col items-center justify-center bg-white border border-[#E5E9F2] gap-2 flex-shrink-0">
              <p className="text-[17px] font-semibold text-[#374151]">
                No discussions found.
              </p>
              <p className="text-[14px] text-[#9CA3AF]">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginatedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  onNavigate={() => navigate(`/post/${post._id}`)}
                  onDelete={(id) => handleDeletePost(id)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        <CategoryFilter
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          appliedCategories={appliedCategories}
          selectedMoods={selectedMoods}
          toggleMood={toggleMood}
          filterCounselorReplied={filterCounselorReplied}
          setFilterCounselorReplied={setFilterCounselorReplied}
          filterHasReplies={filterHasReplies}
          setFilterHasReplies={setFilterHasReplies}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
          isFiltered={isFiltered}
          appliedMoods={appliedMoods}
          appliedSort={appliedSort}
          appliedCounselorReplied={appliedCounselorReplied}
          appliedHasReplies={appliedHasReplies}
        />
      </div>
    </div>
  );
};

const PostManagement = () => {
  return (
    <PostManagementProvider>
      <PostManagementInner />
    </PostManagementProvider>
  );
};

export default PostManagement;