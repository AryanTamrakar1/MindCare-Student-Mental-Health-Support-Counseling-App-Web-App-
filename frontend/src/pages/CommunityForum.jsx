import { useContext } from "react";
import {
  Search,
  Plus,
  X,
  Lock,
  TrendingUp,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import PostCard from "../components/communityForum/PostCard";
import Navbar from "../components/Navbar";
import { CommunityForumProvider } from "../context/communityForum/CommunityForumContext";
import { PostCreationProvider } from "../context/communityForum/PostCreationContext";
import { useCommunityForum } from "../hooks/communityForum/useCommunityForum";
import { usePostCreation } from "../hooks/communityForum/usePostCreation";

const FILTER_CATEGORIES = [
  "Academic & Exam Pressure",
  "Skill Gap & Job Anxiety",
  "Family & Social Pressure",
  "Emotional & Personal Issues",
  "Sleep & Physical Wellbeing",
  "General Mental Health",
];

const MOOD_TAGS = [
  { label: "Overwhelmed", icon: null, color: "#EF4444" },
  { label: "Struggling", icon: null, color: "#F97316" },
  { label: "Confused", icon: null, color: "#F59E0B" },
  { label: "Frustrated", icon: null, color: "#F43F5E" },
  { label: "Hopeful", icon: null, color: "#10B981" },
];

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

const Checkbox = ({ checked, onChange, label, icon: Icon, iconColor }) => (
  <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F5F9FF] transition-colors group">
    <div
      onClick={onChange}
      className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
        checked
          ? "bg-[#2563EB] border-[#2563EB]"
          : "bg-white border-[#D1D5DB] group-hover:border-[#2563EB]"
      }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path
            d="M1 3.5L3.5 6L8 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <div className="flex items-center gap-2 flex-1">
      {Icon && (
        <Icon
          size={13}
          strokeWidth={2}
          style={{ color: checked ? iconColor : "#9CA3AF", flexShrink: 0 }}
        />
      )}
      <span
        className={`text-[13px] leading-snug select-none ${checked ? "font-semibold text-[#111827]" : "font-medium text-[#374151]"}`}
      >
        {label}
      </span>
    </div>
  </label>
);

const CommunityForumInner = () => {
  const { user } = useContext(AuthContext);
  const {
    posts,
    showMyPosts,
    setShowMyPosts,
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
    toggleCategory,
    toggleMood,
    setSortBy,
    setFilterCounselorReplied,
    setFilterHasReplies,
    handleApplyFilter,
    handleClearFilter,
    handleDeletePost,
    handleClearSearch,
    paginatedPosts,
    totalPages,
    isFiltered,
  } = useCommunityForum();

  const {
    isExpanded,
    setIsExpanded,
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
    newCategory,
    setNewCategory,
    newMoodTag,
    setNewMoodTag,
    posting,
    postError,
    handleCreatePost,
    handleTextareaInput,
  } = usePostCreation();

  const getProfilePhoto = () => {
    if (user?.verificationPhoto)
      return `http://127.0.0.1:5050/uploads/verifications/${user.verificationPhoto}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=2563EB&color=fff&size=100`;
  };

  const myPostsCount = posts.filter(
    (p) => p.authorId?.toString() === user?._id?.toString(),
  ).length;

  if (!user) {
    return null;
  }

  return (
    <div
      className="bg-[#EFF6FF]"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {user?.role === "Student" && <StudentSidebar user={user} />}
      {user?.role === "Counselor" && <CounselorSidebar user={user} />}
      <Navbar />

      <div
        style={{
          position: "fixed",
          top: "72px",
          left: "260px",
          right: 0,
          bottom: 0,
          display: "grid",
          gridTemplateColumns: "320px minmax(500px, 1fr) 272px",
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
            flex: 1,
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
            gap: "16px",
            paddingRight: "4px",
          }}
        >
          <div className="relative bg-white border border-[#E9F0FB] flex-shrink-0">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search posts by title or content…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-[14px] text-[14px] font-medium text-[#111827] placeholder-[#9CA3AF] outline-none bg-transparent"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {user?.role === "Student" && (
            <div className="bg-white border border-[#E9F0FB] overflow-hidden flex-shrink-0">
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <img
                  src={getProfilePhoto()}
                  alt="You"
                  className="w-9 h-9  border-2 border-[#E5E7EB] flex-shrink-0"
                />
                <span className="text-[14px] text-[#9CA3AF] font-medium flex-1">
                  Share your thoughts anonymously…
                </span>
                {isExpanded ? (
                  <X size={15} className="text-[#9CA3AF]" />
                ) : (
                  <Plus size={15} className="text-[#9CA3AF]" />
                )}
              </div>
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-[#F3F7FF] pt-4">
                  <div className="bg-[#EEF2FF] px-4 py-2.5 mb-4 flex items-center gap-2">
                    <Lock size={13} className="text-[#2563EB] flex-shrink-0" />
                    <p className="text-[#2563EB] text-[12px] font-semibold">
                      Your post will be completely anonymous. No one will see
                      your name.
                    </p>
                  </div>
                  <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
                    Post Title
                  </p>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Write a short title..."
                    className="w-full border border-[#E9F0FB] px-4 py-3 text-[14px] text-[#374151] outline-none mb-4 focus:border-[#2563EB] transition"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
                    What is your post about?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {FILTER_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`text-[12px] font-semibold px-3 py-2 border transition-all ${
                          newCategory === cat
                            ? "bg-[#2563EB] text-white border-[#2563EB]"
                            : "bg-[#F8FAFF] text-[#6B7280] border-[#E5EDFF] hover:border-[#2563EB] hover:text-[#2563EB]"
                        }`}
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
                    How are you feeling?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {MOOD_TAGS.map(({ label, color }) => (
                      <button
                        key={label}
                        onClick={() => setNewMoodTag(label)}
                        className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 border transition-all ${
                          newMoodTag === label
                            ? "bg-[#2563EB] text-white border-[#2563EB]"
                            : "bg-[#F8FAFF] text-[#6B7280] border-[#E5EDFF] hover:border-[#2563EB] hover:text-[#2563EB]"
                        }`}
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">
                    Your Post
                  </p>
                  <textarea
                    value={newContent}
                    onChange={handleTextareaInput}
                    placeholder="What's on your mind? This is a safe space..."
                    rows={3}
                    className="w-full border border-[#E9F0FB] px-4 py-3 text-[14px] text-[#374151] outline-none resize-none mb-3 focus:border-[#2563EB] transition overflow-hidden"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  {postError && (
                    <p className="text-red-500 text-[12px] mb-3">{postError}</p>
                  )}
                  <button
                    onClick={handleCreatePost}
                    disabled={posting}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[14px] py-3 transition disabled:opacity-50"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {posting ? "Posting..." : "Post Anonymously"}
                  </button>
                </div>
              )}
            </div>
          )}

          {paginatedPosts.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-[#E9F0FB] flex-shrink-0">
              <p className="text-[#9CA3AF] font-bold text-[15px]">
                No posts found.
              </p>
              {user?.role === "Student" && !searchTerm && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="mt-3 text-[#2563EB] font-black text-[11px] uppercase tracking-widest hover:underline"
                >
                  Be the first to post!
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="mt-3 text-[#2563EB] font-black text-[11px] uppercase tracking-widest hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {paginatedPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={user}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 pb-6 flex-shrink-0">
                  <p className="text-[13px] font-medium text-[#9CA3AF]">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-[13px] font-semibold text-[#374151] bg-white border border-[#E5E9F2] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num)}
                          className={`w-9 h-9 text-[13px] font-semibold border transition-colors ${
                            currentPage === num
                              ? "bg-[#2563EB] text-white border-[#2563EB]"
                              : "bg-white text-[#374151] border-[#E5E9F2] hover:bg-[#F3F4F6]"
                          }`}
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {num}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-[13px] font-semibold text-[#374151] bg-white border border-[#E5E9F2] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className="bg-white border border-[#E5E9F2]"
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="px-5 py-4 border-b border-[#E5E9F2] flex items-center justify-between flex-shrink-0">
            <p className="text-[15px] font-bold text-[#111827]">Filter Posts</p>
            {isFiltered && (
              <span className="text-[11px] font-bold text-white bg-[#2563EB] px-2.5 py-0.5">
                Active
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {user?.role === "Student" && (
              <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  View
                </p>
                <div className="flex flex-col gap-0.5">
                  {[
                    { value: false, label: "All Posts", count: posts.length },
                    { value: true, label: "Your Posts", count: myPostsCount },
                  ].map(({ value, label, count }) => (
                    <label
                      key={label}
                      onClick={() => setShowMyPosts(value)}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group ${
                        showMyPosts === value
                          ? "bg-[#EEF2FF]"
                          : "hover:bg-[#F5F9FF]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 flex-shrink-0  border-2 flex items-center justify-center transition-colors ${
                          showMyPosts === value
                            ? "border-[#2563EB]"
                            : "border-[#D1D5DB] group-hover:border-[#2563EB]"
                        }`}
                      >
                        {showMyPosts === value && (
                          <div className="w-2 h-2  bg-[#2563EB]" />
                        )}
                      </div>
                      <span
                        className={`text-[13px] select-none flex-1 ${showMyPosts === value ? "font-semibold text-[#2563EB]" : "font-medium text-[#374151]"}`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${showMyPosts === value ? "text-[#2563EB] opacity-70" : "text-[#9CA3AF]"}`}
                      >
                        {count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                Topic
              </p>
              <div className="flex flex-col gap-0.5">
                <Checkbox
                  checked={selectedCategories.length === 0}
                  onChange={() => setSelectedCategories([])}
                  label="All"
                />
                {FILTER_CATEGORIES.map((cat) => (
                  <Checkbox
                    key={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    label={cat}
                  />
                ))}
              </div>
            </div>

            <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                Mood
              </p>
              <div className="flex flex-col gap-0.5">
                <Checkbox
                  checked={selectedMoods.length === 0}
                  onChange={() => setSelectedMoods([])}
                  label="All Moods"
                />
                {MOOD_TAGS.map(({ label, color }) => (
                  <Checkbox
                    key={label}
                    checked={selectedMoods.includes(label)}
                    onChange={() => toggleMood(label)}
                    label={label}
                    icon={null}
                    iconColor={color}
                  />
                ))}
              </div>
            </div>

            <div className="px-4 pt-4 pb-4 border-b border-[#E5E9F2]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                Sort By
              </p>
              <div className="flex flex-col gap-0.5">
                {[
                  { value: "none", label: "Default", icon: null },
                  {
                    value: "most-liked",
                    label: "Most Liked",
                    icon: TrendingUp,
                  },
                  {
                    value: "most-commented",
                    label: "Most Replied",
                    icon: MessageCircle,
                  },
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    onClick={() => setSortBy(value)}
                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group ${
                      sortBy === value ? "bg-[#EEF2FF]" : "hover:bg-[#F5F9FF]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                        sortBy === value
                          ? "border-[#2563EB]"
                          : "border-[#D1D5DB] group-hover:border-[#2563EB]"
                      }`}
                    >
                      {sortBy === value && (
                        <div className="w-2 h-2  bg-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <Icon
                          size={13}
                          strokeWidth={2}
                          className={
                            sortBy === value
                              ? "text-[#2563EB]"
                              : "text-[#9CA3AF]"
                          }
                        />
                      )}
                      <span
                        className={`text-[13px] select-none ${
                          sortBy === value
                            ? "font-semibold text-[#2563EB]"
                            : "font-medium text-[#374151]"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-4 pt-4 pb-4 flex flex-col gap-2.5">
              <button
                onClick={handleApplyFilter}
                className="w-full py-3 text-[14px] font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Apply Filter
              </button>
              <button
                onClick={handleClearFilter}
                className="w-full py-3 text-[14px] font-semibold text-[#374151] bg-white border border-[#E5E9F2] hover:bg-[#F5F9FF] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunityForum = () => {
  return (
    <CommunityForumProvider>
      <PostCreationProvider>
        <CommunityForumInner />
      </PostCreationProvider>
    </CommunityForumProvider>
  );
};

export default CommunityForum;
