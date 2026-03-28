import { useState } from "react";
import { Heart, MessageCircle, Trash2, Frown, CloudRain, Meh, Zap, Smile, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function buildReplyTree(replies) {
  const replyMap = {};
  const rootReplies = [];

  for (let i = 0; i < replies.length; i++) {
    const reply = replies[i];
    replyMap[reply._id.toString()] = {
      _id: reply._id,
      content: reply.content,
      authorId: reply.authorId,
      authorRole: reply.authorRole,
      authorName: reply.authorName,
      authorPhoto: reply.authorPhoto,
      parentReplyId: reply.parentReplyId,
      likes: reply.likes,
      createdAt: reply.createdAt,
      children: [],
    };
  }

  for (let i = 0; i < replies.length; i++) {
    const reply = replies[i];
    if (reply.parentReplyId) {
      const parentId = reply.parentReplyId.toString();
      if (replyMap[parentId]) {
        replyMap[parentId].children.push(replyMap[reply._id.toString()]);
      }
    } else {
      rootReplies.push(replyMap[reply._id.toString()]);
    }
  }

  return rootReplies;
}

const categoryColor = {
  "Academic & Exam Pressure":   { bg: "#EFF6FF", text: "#2563EB", dot: "#3B82F6" },
  "Skill Gap & Job Anxiety":    { bg: "#EEF2FF", text: "#4F46E5", dot: "#4F46E5" },
  "Family & Social Pressure":   { bg: "#FFFBEB", text: "#D97706", dot: "#F59E0B" },
  "Emotional & Personal Issues":{ bg: "#FDF2F8", text: "#DB2777", dot: "#EC4899" },
  "Sleep & Physical Wellbeing": { bg: "#F0FDF4", text: "#059669", dot: "#10B981" },
  "General Mental Health":      { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" },
};

const moodIcon = {
  Overwhelmed: Frown,
  Struggling:  CloudRain,
  Confused:    Meh,
  Frustrated:  Zap,
  Hopeful:     Smile,
};

const moodColor = {
  Overwhelmed: "#EF4444",
  Struggling:  "#F97316",
  Confused:    "#F59E0B",
  Frustrated:  "#F43F5E",
  Hopeful:     "#10B981",
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

  let alreadyClicked = false;
  if (currentUser && currentUser._id) {
    for (let i = 0; i < post.iFeelThis.length; i++) {
      if (post.iFeelThis[i].toString() === currentUser._id.toString()) {
        alreadyClicked = true;
        break;
      }
    }
  }

  const [iFeelCount, setIFeelCount] = useState(post.iFeelThis.length);
  const [iClicked, setIClicked] = useState(alreadyClicked);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  let isMyPost = false;
  if (post.authorId && currentUser && currentUser._id) {
    if (post.authorId.toString() === currentUser._id.toString()) isMyPost = true;
  }

  const topLevelReplies = buildReplyTree(post.replies);

  let canDelete = false;
  if (currentUser && currentUser.role === "Admin") canDelete = true;
  else if (isMyPost) canDelete = true;

  const handleIFeelThis = async (e) => {
    e.stopPropagation();
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${post._id}/ifeelthis`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
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

  const MoodIcon = moodIcon[post.moodTag] || Meh;
  const moodC    = moodColor[post.moodTag] || "#9CA3AF";
  const catStyle = categoryColor[post.category] || { bg: "#F9FAFB", text: "#6B7280", dot: "#9CA3AF" };

  return (
    <>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 w-full max-w-sm mx-4 shadow-xl border border-[#E9F0FB]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <h3 className="text-[#111827] font-black text-[18px] mb-2">Delete Post?</h3>
            <p className="text-[#6B7280] text-[14px] mb-5">This will permanently delete the post and all its replies.</p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
                className="flex-1 py-2.5 border border-[#E9F0FB] text-[#374151] font-semibold text-[14px] hover:bg-[#F9FAFB] transition"
              >Cancel</button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-500 text-white font-semibold text-[14px] hover:bg-red-600 transition"
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => navigate(`/post/${post._id}`)}
        className="bg-white border border-[#E5E9F2] cursor-pointer hover:border-[#B8C7F0] hover:shadow-sm transition-all duration-200 group"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5"
                style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
              >
                {post.category}
              </span>
              <span className="text-[11px] font-semibold bg-[#EEF2FF] text-[#2563EB] border border-[#C7D2FE] px-2 py-0.5">
                Anonymous
              </span>
              {isMyPost && (
                <span className="text-[11px] font-semibold bg-[#EEF2FF] text-[#2563EB] border border-[#C7D2FE] px-2 py-0.5">
                  Your Post
                </span>
              )}
            </div>
            {canDelete && (
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FECACA] transition-colors flex-shrink-0"
              >
                <Trash2 size={13} strokeWidth={2} />
                Delete
              </button>
            )}
          </div>

          <h3 className="text-[17px] font-bold text-[#111827] mb-2 leading-snug group-hover:text-[#2563EB] transition-colors">
            {post.title}
          </h3>

          <p
            className="text-[14px] text-[#6B7280] leading-relaxed mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </p>

          <div className="flex items-center gap-5 pt-3.5 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-3 text-[13px] text-[#9CA3AF]">
              <div className="flex items-center gap-1" style={{ color: moodC }}>
                <MoodIcon size={13} strokeWidth={2} />
                <span className="font-medium">{post.moodTag}</span>
              </div>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={handleIFeelThis}
                className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${
                  iClicked ? "text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#2563EB]"
                }`}
              >
                <Heart size={15} strokeWidth={2} className={iClicked ? "fill-[#2563EB]" : ""} />
                {iFeelCount}
              </button>

              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#9CA3AF]">
                <MessageCircle size={15} strokeWidth={2} />
                {topLevelReplies.length}
              </div>

              <ChevronRight size={15} className="text-[#C4C9D4] group-hover:text-[#2563EB] transition-colors" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;