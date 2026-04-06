import React from "react";
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  Trash2,
  Frown,
  CloudRain,
  Meh,
  Zap,
  Smile,
} from "lucide-react";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import ReplyItem from "../components/communityForum/ReplyItem";
import { PostDetailProvider } from "../context/postDetail/PostDetailContext";
import { usePostDetail } from "../hooks/postDetail/usePostDetail";
import { useNavigate } from "react-router-dom";

const categoryStyle = {
  "Academic & Exam Pressure": { bg: "#EFF6FF", text: "#2563EB" },
  "Skill Gap & Job Anxiety": { bg: "#EEF2FF", text: "#4338CA" },
  "Family & Social Pressure": { bg: "#FFFBEB", text: "#B45309" },
  "Emotional & Personal Issues": { bg: "#FDF2F8", text: "#9D174D" },
  "Sleep & Physical Wellbeing": { bg: "#F0FDF4", text: "#15803D" },
  "General Mental Health": { bg: "#F3F4F6", text: "#374151" },
};

const moodMeta = {
  Overwhelmed: { icon: Frown, color: "#EF4444" },
  Struggling: { icon: CloudRain, color: "#F97316" },
  Confused: { icon: Meh, color: "#EAB308" },
  Frustrated: { icon: Zap, color: "#F43F5E" },
  Hopeful: { icon: Smile, color: "#10B981" },
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const PostDetailInner = () => {
  const navigate = useNavigate();
  const {
    user,
    post,
    iFeelCount,
    iClicked,
    replyText,
    setReplyText,
    submitting,
    allReplies,
    setAllReplies,
    showReplyArea,
    setShowReplyArea,
    backPath,
    backLabel,
    handleIFeelThis,
    handleTopLevelReply,
    handleReplyGrow,
    handleDeleteReply,
    handleDeletePost,
    isMyPost,
    replyTree,
    id,
  } = usePostDetail();

  const SidebarComponent = () => {
    if (user?.role === "Student") return <StudentSidebar user={user} />;
    if (user?.role === "Counselor") return <CounselorSidebar user={user} />;
    if (user?.role === "Admin") return <AdminSidebar user={user} />;
    return null;
  };

  if (!user) {
    return null;
  }

  if (!post) {
    return (
      <div
        className="min-h-screen flex"
        style={{
          backgroundColor: "#EFF4FB",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <Navbar />
        <SidebarComponent />
        <main className="flex-1 ml-[260px] pt-[72px] flex items-center justify-center">
          <p className="text-[16px] font-medium text-[#9CA3AF]">
            Post not found.
          </p>
        </main>
      </div>
    );
  }

  const mood = moodMeta[post.moodTag] || { icon: Meh, color: "#9CA3AF" };
  const MoodIcon = mood.icon;
  const catSt = categoryStyle[post.category] || {
    bg: "#F3F4F6",
    text: "#374151",
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#EFF4FB",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Navbar />
      <SidebarComponent />

      <main className="flex-1 ml-[260px] pt-[72px] overflow-y-auto">
        <div className="max-w-[980px] mx-auto px-10 py-8">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#9CA3AF] hover:text-[#2563EB] transition-colors mb-7"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            {backLabel}
          </button>

          <div className="bg-white border border-[#E5E9F2]">
            <div className="px-8 pt-7 pb-6">
              <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1"
                  style={{ backgroundColor: catSt.bg, color: catSt.text }}
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
                <span
                  className="flex items-center gap-1.5 text-[12px] font-semibold"
                  style={{ color: mood.color }}
                >
                  <MoodIcon size={13} strokeWidth={2} />
                  {post.moodTag}
                </span>
                <span className="ml-auto text-[12px] text-[#9CA3AF]">
                  {timeAgo(post.createdAt)}
                </span>
              </div>

              <h1
                className="text-[26px] font-bold text-[#111827] leading-snug mb-4"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textAlign: "justify",
                }}
              >
                {post.title}
              </h1>

              <p
                className="text-[15px] text-[#374151] leading-[1.8] whitespace-pre-wrap mb-7"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textAlign: "justify",
                }}
              >
                {post.content}
              </p>

              <div className="flex items-center gap-1 pt-5 border-t border-[#F3F4F6]">
                {user?.role === "Admin" ? (
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#9CA3AF] px-3 py-2">
                    <Heart size={15} strokeWidth={2} />
                    {iFeelCount} feel this
                  </span>
                ) : (
                  <button
                    onClick={handleIFeelThis}
                    className={`flex items-center gap-2 text-[13px] font-semibold px-3 py-2 transition-colors ${
                      iClicked
                        ? "text-[#2563EB]"
                        : "text-[#9CA3AF] hover:text-[#2563EB]"
                    }`}
                  >
                    <Heart
                      size={15}
                      strokeWidth={2}
                      className={iClicked ? "fill-[#2563EB]" : ""}
                    />
                    {iFeelCount} feel this
                  </button>
                )}

                <button
                  onClick={() => setShowReplyArea(!showReplyArea)}
                  className={`flex items-center gap-2 text-[13px] font-semibold px-3 py-2 transition-colors ${
                    showReplyArea
                      ? "text-[#2563EB]"
                      : "text-[#9CA3AF] hover:text-[#2563EB]"
                  }`}
                >
                  <MessageCircle size={15} strokeWidth={2} />
                  {allReplies.length}{" "}
                  {allReplies.length === 1 ? "reply" : "replies"}
                </button>

                {(user?.role === "Admin" || isMyPost) && (
                  <button
                    onClick={handleDeletePost}
                    className="ml-auto flex items-center gap-2 text-[13px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FECACA] px-3 py-2 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                    Delete Post
                  </button>
                )}
              </div>
            </div>

            {showReplyArea && (
              <div className="border-t border-[#F3F4F6]">
                {user?.role !== "Admin" && (
                  <div className="px-8 py-5 bg-[#FAFBFE] border-b border-[#F3F4F6]">
                    <p className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                      {user?.role === "Counselor"
                        ? "Reply as Counselor"
                        : "Write a reply"}
                    </p>
                    <div
                      className="flex gap-3"
                      style={{ alignItems: "stretch" }}
                    >
                      {user?.role === "Counselor" && user?.verificationPhoto ? (
                        <img
                          src={user.verificationPhoto}
                          alt={user.name}
                          className="w-9 h-9 object-cover flex-shrink-0 border-2 border-[#C7D2FE] self-start mt-[3px]"
                        />
                      ) : user?.role === "Counselor" ? (
                        <div className="w-9 h-9 bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center flex-shrink-0 text-[#2563EB] font-bold text-[12px] self-start mt-[3px]">
                          {user?.name?.charAt(0) || "C"}
                        </div>
                      ) : null}
                      <textarea
                        value={replyText}
                        onChange={(e) => {
                          setReplyText(e.target.value);
                          handleReplyGrow(e);
                        }}
                        placeholder={
                          user?.role === "Counselor"
                            ? "Share your professional perspective..."
                            : "Write a supportive reply..."
                        }
                        className="flex-1 border border-[#E5E9F2] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] outline-none focus:border-[#2563EB] transition-colors placeholder:text-[#C4C9D4] resize-none overflow-hidden"
                        style={{
                          minHeight: "46px",
                          height: "46px",
                          lineHeight: "1.5",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      />
                      <button
                        onClick={handleTopLevelReply}
                        disabled={submitting || !replyText.trim()}
                        className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 flex-shrink-0 flex items-center justify-center"
                        style={{
                          width: "46px",
                          height: "46px",
                          alignSelf: "flex-start",
                        }}
                      >
                        <Send size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="px-8 py-6">
                  {replyTree.length === 0 ? (
                    <p className="text-[14px] text-[#9CA3AF] text-center py-8">
                      No replies yet. Be the first to respond.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {replyTree.map((reply) => (
                        <ReplyItem
                          key={reply._id}
                          reply={reply}
                          postId={id}
                          currentUser={user}
                          onReplyAdded={(newReplies) =>
                            setAllReplies(newReplies)
                          }
                          onDeleteReply={handleDeleteReply}
                          onEditReply={(newReplies) =>
                            setAllReplies(newReplies)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const PostDetail = () => {
  return (
    <PostDetailProvider>
      <PostDetailInner />
    </PostDetailProvider>
  );
};

export default PostDetail;
