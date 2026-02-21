import { Trash2, MessageSquare } from "lucide-react";

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

const PostCard = ({ post, onNavigate, onDeleteClick }) => {
  const topLevelReplies = [];
  for (let i = 0; i < post.replies.length; i++) {
    if (!post.replies[i].parentReplyId) {
      topLevelReplies.push(post.replies[i]);
    }
  }

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200"
      onClick={() => onNavigate(post._id)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Anonymous Student</p>
            <p className="text-xs text-gray-400">
              {moodEmoji[post.moodTag]} {post.moodTag} ·{" "}
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-black px-3 py-1.5 rounded-full border ${categoryColor[post.category]}`}
        >
          {post.category}
        </span>
      </div>

      <h3 className="text-gray-900 font-black text-base mb-2">{post.title}</h3>
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
        <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          I feel this too ({post.iFeelThis.length})
        </span>
        <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <MessageSquare size={14} />
          Replies ({topLevelReplies.length})
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(post._id);
          }}
          className="ml-auto flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default PostCard;
