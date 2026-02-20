import { useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const categoryColor = {
  "Academic & Exam Pressure": "bg-blue-100 text-blue-700 border-blue-200",
  "Skill Gap & Job Anxiety": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Family & Social Pressure": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Emotional & Personal Issues": "bg-pink-100 text-pink-700 border-pink-200",
  "Sleep & Physical Wellbeing": "bg-green-100 text-green-700 border-green-200",
  "General Mental Health": "bg-gray-100 text-gray-600 border-gray-200",
};

const moodEmoji = {
  Overwhelmed: "😰",
  Struggling: "😞",
  Confused: "😕",
  Frustrated: "😤",
  Hopeful: "🙂",
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const PostCard = ({ post, currentUser, onDelete }) => {
  const navigate = useNavigate();
  const [iFeelCount, setIFeelCount] = useState(post.iFeelThis.length);
  const [iClicked, setIClicked] = useState(
    post.iFeelThis
      .map((id) => id.toString())
      .includes(currentUser?._id?.toString())
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isMyPost =
    post.authorId?.toString() === currentUser?._id?.toString();

  const topLevelReplies = post.replies.filter((r) => !r.parentReplyId);

  const canDelete = currentUser?.role === "Admin" || isMyPost;

  const handleIFeelThis = async (e) => {
    e.stopPropagation();
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${post._id}/ifeelthis`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIFeelCount(res.data.iFeelThisCount);
      setIClicked(!iClicked);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onDelete(post._id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-gray-800 font-black text-lg mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm mb-5">
              This will permanently delete the post and all its replies.
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => navigate(`/post/${post._id}`)}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Anonymous Student
                {isMyPost && (
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 font-black px-2 py-0.5 rounded-full border border-indigo-200">
                    Your Post
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {moodEmoji[post.moodTag]} {post.moodTag} · {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${categoryColor[post.category]}`}>
            {post.category}
          </span>
        </div>

        <h3 className="text-gray-900 font-black text-base mb-2">
          {post.title}
        </h3>

        <p
          className="text-gray-500 text-sm leading-relaxed mb-4"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textAlign: "justify",
          }}
        >
          {post.content}
        </p>

        <div className="flex items-center gap-5 pt-3 border-t border-gray-100">

          <button
            onClick={handleIFeelThis}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              iClicked ? "text-indigo-600" : "text-gray-400 hover:text-indigo-500"
            }`}
          >
            <Heart
              size={15}
              className={iClicked ? "fill-indigo-600 text-indigo-600" : ""}
            />
            I feel this too ({iFeelCount})
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/post/${post._id}`); }}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-500 transition"
          >
            <MessageCircle size={15} />
            Replies ({topLevelReplies.length})
          </button>

          {canDelete && (
            <button
              onClick={handleDeleteClick}
              className="ml-auto flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition"
            >
              <Trash2 size={15} />
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PostCard;