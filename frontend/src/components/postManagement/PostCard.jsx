import { useState } from "react";
import { Heart, MessageCircle, Trash2, Frown, CloudRain, Meh, Zap, Smile, ChevronRight } from "lucide-react";
import API from "../../api/axios";

const categoryColor = {
  "Academic & Exam Pressure":    { bg: "#EFF6FF", text: "#2563EB" },
  "Skill Gap & Job Anxiety":     { bg: "#EEF2FF", text: "#4F46E5" },
  "Family & Social Pressure":    { bg: "#FFFBEB", text: "#D97706" },
  "Emotional & Personal Issues": { bg: "#FDF2F8", text: "#DB2777" },
  "Sleep & Physical Wellbeing":  { bg: "#F0FDF4", text: "#059669" },
  "General Mental Health":       { bg: "#F9FAFB", text: "#6B7280" },
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

const PostCard = ({ post, currentUser, onNavigate, onDelete }) => {
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

  const topLevelReplies = [];
  for (let i = 0; i < post.replies.length; i++) {
    if (!post.replies[i].parentReplyId) {
      topLevelReplies.push(post.replies[i]);
    }
  }

  let canDelete = false;
  if (currentUser && currentUser.role === "Admin") {
    canDelete = true;
  }

  let MoodIcon = Meh;
  if (moodIcon[post.moodTag]) {
    MoodIcon = moodIcon[post.moodTag];
  }

  let moodC = "#9CA3AF";
  if (moodColor[post.moodTag]) {
    moodC = moodColor[post.moodTag];
  }

  let catStyle = { bg: "#F9FAFB", text: "#6B7280" };
  if (categoryColor[post.category]) {
    catStyle = categoryColor[post.category];
  }

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
    onDelete(post._id);
  };

  let feelButtonClass = "text-[#9CA3AF] hover:text-[#2563EB]";
  if (iClicked) {
    feelButtonClass = "text-[#2563EB]";
  }

  let heartFillClass = "";
  if (iClicked) {
    heartFillClass = "fill-[#2563EB]";
  }

  return (
    <div
      onClick={onNavigate}
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
            {(post.category === "Academic & Exam Pressure" ||
              post.category === "Skill Gap & Job Anxiety" ||
              post.category === "Family & Social Pressure" ||
              post.category === "Emotional & Personal Issues" ||
              post.category === "Sleep & Physical Wellbeing" ||
              post.category === "General Mental Health") && (
              <span className="text-[11px] font-semibold bg-[#EEF2FF] text-[#2563EB] border border-[#C7D2FE] px-2 py-0.5">
                Anonymous
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
              className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${feelButtonClass}`}
            >
              <Heart size={15} strokeWidth={2} className={heartFillClass} />
              {iFeelCount}
            </button>

            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#9CA3AF]">
              <MessageCircle size={15} strokeWidth={2} />
              {post.replies.length}
            </div>

            <ChevronRight size={15} className="text-[#C4C9D4] group-hover:text-[#2563EB] transition-colors" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;