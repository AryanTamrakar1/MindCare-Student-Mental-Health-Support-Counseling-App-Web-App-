import { useState, useEffect, useContext } from "react";
import { Search, Trash2, MessageSquare, FileText, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const categoryColor = {
  "Academic & Exam Pressure": "bg-blue-100 text-blue-700 border-blue-200",
  "Skill Gap & Job Anxiety": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Family & Social Pressure": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Emotional & Personal Issues": "bg-pink-100 text-pink-700 border-pink-200",
  "Sleep & Physical Wellbeing": "bg-green-100 text-green-700 border-green-200",
  "General Mental Health": "bg-gray-100 text-gray-600 border-gray-200",
};

const moodEmoji = {
  Overwhelmed: "😰", Struggling: "😞", Confused: "😕",
  Frustrated: "😤", Hopeful: "🙂",
};

const categories = [
  "All",
  "Academic & Exam Pressure",
  "Skill Gap & Job Anxiety",
  "Family & Social Pressure",
  "Emotional & Personal Issues",
  "Sleep & Physical Wellbeing",
  "General Mental Health",
];

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const POSTS_PER_PAGE = 5;

const PostManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/forum", { headers: { Authorization: `Bearer ${token}` } });
      setPosts(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(posts.filter((p) => p._id !== postId));
      setShowDeleteConfirm(null);
    } catch (error) { console.log("Error:", error); }
  };

  const handleClearSearch = () => { setSearchTerm(""); setCurrentPage(1); };

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === "All" ? true : p.category === selectedCategory;
    const matchesSearch = searchTerm
      ? p.content.toLowerCase().includes(searchTerm.toLowerCase()) || p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const totalReplies = posts.reduce((acc, p) => acc + p.replies.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <AdminSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Posts...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <AdminSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">

        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Post Management</h2>
            <p className="text-gray-500">Monitor and moderate community forum posts.</p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <FileText size={22} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{posts.length}</p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Posts</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={22} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{totalReplies}</p>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Replies</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-2">Search Posts</p>
        <div className="border-b border-gray-200 mb-3"></div>
        <div className="flex bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 flex-1 px-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title or content..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="flex-1 outline-none text-sm text-gray-600 font-medium"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
          <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">Filter by Category</p>
          <div className="border-b border-gray-100 mb-4"></div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-3">
          {filteredPosts.length} Post{filteredPosts.length !== 1 ? "s" : ""}
        </p>
        <div className="border-b border-gray-200 mb-4"></div>

        {paginatedPosts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-lg">No posts found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedPosts.map((post) => {
              const topLevelReplies = post.replies.filter((r) => !r.parentReplyId);
              return (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Anonymous Student</p>
                        <p className="text-xs text-gray-400">{moodEmoji[post.moodTag]} {post.moodTag} · {timeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${categoryColor[post.category]}`}>{post.category}</span>
                  </div>
                  <h3 className="text-gray-900 font-black text-base mb-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textAlign: "justify" }}>{post.content}</p>
                  <div className="flex items-center gap-5 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      I feel this too ({post.iFeelThis.length})
                    </span>
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <MessageSquare size={14} />Replies ({topLevelReplies.length})
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(post._id); }} className="ml-auto flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition">
                      <Trash2 size={14} />Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 pb-6">
            {[...Array(totalPages)].map((_, index) => (
              <button key={index} onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 border ${currentPage === index + 1 ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-gray-400 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"}`}>
                {index + 1}
              </button>
            ))}
          </div>
        )}

      </main>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-gray-800 font-black text-lg mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently delete the post and all replies.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDeletePost(showDeleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;