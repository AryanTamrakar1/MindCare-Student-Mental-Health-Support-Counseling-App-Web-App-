import { useState, useEffect, useContext } from "react";
import { Search, Plus, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import StudentSidebar from "../components/StudentSidebar";
import CounselorSidebar from "../components/CounselorSidebar";
import PostCard from "../components/Forum/PostCard";
import Navbar from "../components/Navbar";

const categories = [
  "All",
  "Academic & Exam Pressure",
  "Skill Gap & Job Anxiety",
  "Family & Social Pressure",
  "Emotional & Personal Issues",
  "Sleep & Physical Wellbeing",
  "General Mental Health",
];

const moodTags = [
  { label: "Overwhelmed", emoji: "😰" },
  { label: "Struggling", emoji: "😞" },
  { label: "Confused", emoji: "😕" },
  { label: "Frustrated", emoji: "😤" },
  { label: "Hopeful", emoji: "🙂" },
];

const POSTS_PER_PAGE = 5;

const CommunityForum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newMoodTag, setNewMoodTag] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, showMyPosts, searchTerm]);

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/forum", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !newCategory || !newMoodTag) {
      setPostError("Please fill in all fields.");
      return;
    }
    try {
      setPosting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.post(
        "/forum",
        {
          title: newTitle,
          content: newContent,
          category: newCategory,
          moodTag: newMoodTag,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPosts([res.data.post, ...posts]);
      setNewTitle("");
      setNewContent("");
      setNewCategory("");
      setNewMoodTag("");
      setIsExpanded(false);
      setPostError("");
    } catch (error) {
      setPostError("Something went wrong. Try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ? true : p.category === selectedCategory;
    const matchesMyPost = showMyPosts
      ? p.authorId?.toString() === user?._id?.toString()
      : true;
    const matchesSearch = searchTerm
      ? p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesMyPost && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  const getProfilePhoto = () => {
    if (user?.verificationPhoto)
      return `http://127.0.0.1:5050/uploads/verifications/${user.verificationPhoto}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=4f46e5&color=fff&size=100`;
  };

  const handleTextareaInput = (e) => {
    setNewContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        {user?.role === "Student" && <StudentSidebar user={user} />}
        {user?.role === "Counselor" && <CounselorSidebar user={user} />}
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Posts...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {user?.role === "Student" && <StudentSidebar user={user} />}
      {user?.role === "Counselor" && <CounselorSidebar user={user} />}

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Community Forum
            </h2>
            <p className="text-gray-500">
              A safe anonymous space for students to share and support each
              other.
            </p>
          </div>
          <Navbar />
        </div>

        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-2">
          Search Posts
        </p>
        <div className="border-b border-gray-200 mb-3"></div>
        <div className="flex bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 flex-1 px-2">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search posts by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-600 font-medium"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-2">
          <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">
            Filter by Category
          </p>
          <div className="border-b border-gray-100 mb-4"></div>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowMyPosts(false);
                }}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedCategory === cat && !showMyPosts
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
            {user?.role === "Student" && (
              <button
                onClick={() => {
                  setShowMyPosts(!showMyPosts);
                  setSelectedCategory("All");
                }}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 ${
                  showMyPosts
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                Your Post
              </button>
            )}
          </div>
        </div>

        {user?.role === "Student" && (
          <>
            <div className="mt-6 mb-2">
              <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
                Share with the Community
              </p>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <img
                  src={getProfilePhoto()}
                  alt="You"
                  className="w-10 h-10 rounded-full border-2 border-indigo-200 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm flex-1">
                  Share your thoughts anonymously...
                </span>
                {isExpanded ? (
                  <X size={16} className="text-gray-400" />
                ) : (
                  <Plus size={16} className="text-gray-400" />
                )}
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <div className="bg-indigo-50 rounded-xl px-4 py-2 mb-4">
                    <p className="text-indigo-700 text-xs font-bold">
                      🔒 Your post will be completely anonymous. No one will see
                      your name.
                    </p>
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Post Title
                  </p>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Write a short title..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none mb-4 focus:border-indigo-400"
                  />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    What is your post about?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewCategory(cat)}
                          className={`text-xs font-bold px-3 py-2 rounded-full border transition-all ${newCategory === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400"}`}
                        >
                          {cat}
                        </button>
                      ))}
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    How are you feeling?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {moodTags.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => setNewMoodTag(mood.label)}
                        className={`text-xs font-bold px-3 py-2 rounded-full border transition-all ${newMoodTag === mood.label ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400"}`}
                      >
                        {mood.emoji} {mood.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Your Post
                  </p>
                  <textarea
                    value={newContent}
                    onChange={handleTextareaInput}
                    placeholder="What's on your mind? This is a safe space..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none mb-3 focus:border-indigo-400 overflow-hidden"
                    style={{ textAlign: "justify" }}
                  />
                  {postError && (
                    <p className="text-red-500 text-xs mb-3">{postError}</p>
                  )}
                  <button
                    onClick={handleCreatePost}
                    disabled={posting}
                    className="w-full bg-indigo-600 text-white font-black text-sm py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {posting ? "Posting..." : "Post Anonymously"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-4 mb-2 flex items-center justify-between">
          <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
            {filteredPosts.length} Post{filteredPosts.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
        <div className="border-b border-gray-200 mb-4"></div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-lg">No posts found.</p>
            {user?.role === "Student" && !searchTerm && (
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-3 text-indigo-600 font-black text-xs uppercase hover:underline"
              >
                Be the first to post!
              </button>
            )}
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="mt-3 text-indigo-600 font-black text-xs uppercase hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
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
              <div className="flex justify-center items-center gap-2 mt-8 pb-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                >
                  ← Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${currentPage === index + 1 ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-gray-400 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CommunityForum;
