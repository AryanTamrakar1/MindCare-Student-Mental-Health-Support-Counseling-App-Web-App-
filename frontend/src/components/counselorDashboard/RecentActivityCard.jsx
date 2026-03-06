import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import API from "../../api/axios";

const ActivityRow = ({ post, onView }) => {
  let category = "General";
  if (post.category) category = post.category;
  let title = "Community Post";
  if (post.title) title = post.title;
  let replyCount = 0;
  if (post.replies) replyCount = post.replies.length;

  return (
    <div className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <MessageSquare size={14} className="text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {category}: {title}
          </p>
          <p className="text-xs text-slate-400">{replyCount} replies</p>
        </div>
      </div>
      <button
        onClick={onView}
        className="shrink-0 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
      >
        View
      </button>
    </div>
  );
};

const RecentActivityCard = () => {
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
      } catch (err) {}
      setLoading(false);
    };
    fetchPosts();
  }, []);

  function handleView() {
    navigate("/community-forum");
  }

  const hasPosts = posts.length > 0;
  const noPosts = !loading && posts.length === 0;

  return (
    <div className="flex flex-col gap-2.5">
      {loading && (
        <div className="flex items-center justify-center h-20">
          <p className="text-slate-300 text-sm">Loading...</p>
        </div>
      )}

      {noPosts && (
        <div className="flex flex-col items-center justify-center h-20 gap-2">
          <MessageSquare size={22} className="text-slate-200" />
          <p className="text-slate-400 text-xs">No community posts yet</p>
        </div>
      )}

      {!loading && hasPosts && (
        <div className="flex flex-col gap-2.5">
          {posts.map(function (post) {
            return (
              <ActivityRow key={post._id} post={post} onView={handleView} />
            );
          })}
        </div>
      )}

      {!loading && hasPosts && (
        <button
          onClick={handleView}
          className="mt-1 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          View all community posts
        </button>
      )}
    </div>
  );
};

export default RecentActivityCard;
