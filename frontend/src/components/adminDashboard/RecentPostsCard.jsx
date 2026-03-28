import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";
import API from "../../api/axios";

const PostRow = ({ post, onView }) => {
  let preview = post.title || "";
  if (post.content) {
    preview = post.content.substring(0, 60);
    if (post.content.length > 60) {
      preview = preview + "…";
    }
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="flex items-center justify-between gap-4 bg-blue-50 border border-blue-200 px-4 py-3"
    >
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Anonymous</p>
        <p className="text-sm text-gray-700 truncate">"{preview}"</p>
      </div>
      <button
        onClick={onView}
        className="shrink-0 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-200 border border-blue-200 px-3 py-1.5 transition-colors duration-150"
      >
        View Post
      </button>
    </div>
  );
};

const RecentPostsCard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/forum", {
          headers: { Authorization: "Bearer " + token },
        });
        const allPosts = res.data;
        const recent = [];
        for (let i = allPosts.length - 1; i >= 0 && recent.length < 4; i--) {
          recent.push(allPosts[i]);
        }
        setPosts(recent);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const hasPosts = posts.length > 0;
  const noPosts = posts.length === 0;
  const goToPost = () => navigate("/post-management");

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="flex flex-col gap-2.5"
    >
      {loading && (
        <div className="flex items-center justify-center h-20">
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      )}
      {!loading && noPosts && (
        <div className="flex flex-col items-center justify-center h-20 gap-2">
          <MessageSquare size={22} className="text-blue-200" />
          <p className="text-slate-400 text-sm">No community posts yet</p>
        </div>
      )}
      {!loading && hasPosts && (
        <div className="flex flex-col gap-2.5">
          {posts.map(function (post) {
            return <PostRow key={post._id} post={post} onView={goToPost} />;
          })}
        </div>
      )}
      {!loading && hasPosts && (
        <button
          onClick={goToPost}
          className="mt-1 pt-3 border-t border-blue-200 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
        >
          Manage all posts
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
};

export default RecentPostsCard;