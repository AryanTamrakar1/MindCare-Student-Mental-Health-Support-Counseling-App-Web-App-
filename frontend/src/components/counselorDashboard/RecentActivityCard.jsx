import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useCounselorDashboard } from "../../hooks/counselorDashboard/useCounselorDashboard";

const ActivityRow = ({ post, onView }) => {
  let category = "General";
  if (post.category) category = post.category;
  let title = "Community Post";
  if (post.title) title = post.title;
  let replyCount = 0;
  if (post.replies) replyCount = post.replies.length;

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="flex items-center justify-between gap-4 bg-[#F8FAFF] border border-[#DBEAFE] px-4 py-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center shrink-0">
          <MessageSquare size={15} className="text-[#2563EB]" />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#0F172A] truncate">
            {category}: {title}
          </p>
          <p className="text-[12px] text-[#94A3B8]">{replyCount} replies</p>
        </div>
      </div>
      <button
        onClick={onView}
        className="shrink-0 text-[13px] font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#DBEAFE] px-3 py-1.5 transition-colors duration-150"
      >
        View
      </button>
    </div>
  );
};

const RecentActivityCard = () => {
  const navigate = useNavigate();
  const { posts, loading } = useCounselorDashboard();

  function handleView() {
    navigate("/community-forum");
  }

  const hasPosts = posts.length > 0;
  const noPosts = !loading && posts.length === 0;

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="flex flex-col gap-2.5"
    >
      {loading && (
        <div className="flex items-center justify-center h-20">
          <p className="text-[#94A3B8] text-[14px]">Loading...</p>
        </div>
      )}

      {noPosts && (
        <div className="flex flex-col items-center justify-center h-20 gap-2">
          <MessageSquare size={22} className="text-[#DBEAFE]" />
          <p className="text-[#94A3B8] text-[13px]">No community posts yet</p>
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
    </div>
  );
};

export default RecentActivityCard;