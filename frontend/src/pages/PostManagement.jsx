import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import StatsCards from "../components/postManagement/StatsCards";
import PostSearchBar from "../components/postManagement/PostSearchBar";
import CategoryFilter from "../components/postManagement/CategoryFilter";
import PostCard from "../components/postManagement/PostCard";
import DeleteConfirmModal from "../components/postManagement/DeleteConfirmModal";

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

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleDeletePost = async (postId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPosts = [];
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id !== postId) {
          updatedPosts.push(posts[i]);
        }
      }
      setPosts(updatedPosts);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Filter posts
  const filteredPosts = [];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];

    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (p.category === selectedCategory) {
      matchesCategory = true;
    }

    let matchesSearch = false;
    if (!searchTerm) {
      matchesSearch = true;
    } else {
      const search = searchTerm.toLowerCase();
      const content = p.content ? p.content.toLowerCase() : "";
      const title = p.title ? p.title.toLowerCase() : "";
      if (content.includes(search) || title.includes(search)) {
        matchesSearch = true;
      }
    }

    if (matchesCategory && matchesSearch) {
      filteredPosts.push(p);
    }
  }

  let totalReplies = 0;
  for (let i = 0; i < posts.length; i++) {
    totalReplies = totalReplies + posts[i].replies.length;
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = [];
  for (let i = startIndex; i < endIndex && i < filteredPosts.length; i++) {
    paginatedPosts.push(filteredPosts[i]);
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <AdminSidebar user={user} />
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
      <AdminSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Post Management
            </h2>
            <p className="text-gray-500">
              Monitor and moderate community forum posts.
            </p>
          </div>
          <Navbar />
        </div>

        <StatsCards totalPosts={posts.length} totalReplies={totalReplies} />

        <PostSearchBar
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          onClear={handleClearSearch}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

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
            {paginatedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onNavigate={(id) => navigate(`/post/${id}`)}
                onDeleteClick={(id) => setShowDeleteConfirm(id)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 pb-6">
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 border ${
                  currentPage === num
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-400 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </main>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => handleDeletePost(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default PostManagement;
