import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Pencil,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import API from "../../api/axios";
import Avatar from "./Avatar";

const isWithinTenMinutes = (date) =>
  Date.now() - new Date(date).getTime() < 10 * 60 * 1000;

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const ChildReplyItem = ({
  reply,
  postId,
  currentUser,
  onReplyAdded,
  onDeleteReply,
  onEditReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showChildren, setShowChildren] = useState(false);

  let initialLiked = false;
  if (reply.likes && currentUser && currentUser._id) {
    for (let i = 0; i < reply.likes.length; i++) {
      if (reply.likes[i].toString() === currentUser._id.toString()) {
        initialLiked = true;
        break;
      }
    }
  }

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(
    reply.likes ? reply.likes.length : 0,
  );
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const isMyReply =
    reply.authorId && currentUser && currentUser._id
      ? reply.authorId.toString() === currentUser._id.toString()
      : false;

  const canEdit =
    isMyReply &&
    isWithinTenMinutes(reply.createdAt) &&
    currentUser.role !== "Admin";

  const handleLike = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${postId}/reply/${reply._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLikeCount(res.data.likesCount);
      setLiked(!liked);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.post(
        `/forum/${postId}/reply`,
        { content: replyText, parentReplyId: reply._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onReplyAdded(res.data.post.replies);
      setReplyText("");
      setShowReplyInput(false);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editText.trim()) return;
    try {
      setEditSubmitting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${postId}/reply/${reply._id}/edit`,
        { content: editText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onEditReply(res.data.post.replies);
      setIsEditing(false);
    } catch (err) {
      console.log("Edit error:", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reply?",
    );
    if (confirmed) {
      onDeleteReply(reply._id);
    }
  };

  const handleAutoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-[#F8FAFF] p-4 border border-[#E9F0FB]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar
              role={reply.authorRole}
              photo={reply.authorPhoto}
              name={reply.authorName}
            />
            <div>
              {reply.authorRole === "Counselor" ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-[#111827]">
                    {reply.authorName}
                  </p>
                  <span className="text-[11px] bg-[#EEF2FF] text-[#2563EB] font-bold px-2 py-0.5 border border-[#C7D7FD]">
                    Verified Counselor
                  </span>
                </div>
              ) : (
                <p className="text-[13px] font-semibold text-[#111827]">
                  Anonymous Student
                </p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-[#9CA3AF]">
            {timeAgo(reply.createdAt)}
          </p>
        </div>

        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                handleAutoGrow(e);
              }}
              className="w-full border border-[#2563EB] px-3 py-2 text-[13px] text-[#374151] outline-none resize-none overflow-hidden"
              style={{
                minHeight: "72px",
                height: "72px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEditSubmit}
                disabled={editSubmitting}
                className="flex items-center gap-1 bg-[#2563EB] text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-[#1D4ED8] transition"
              >
                <Check size={12} />
                {editSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(reply.content);
                }}
                className="flex items-center gap-1 bg-[#F3F4F6] text-[#374151] text-[12px] font-semibold px-3 py-1.5 hover:bg-[#E5E7EB] transition"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className="text-[13px] text-[#374151] leading-relaxed mb-3 whitespace-pre-wrap"
            style={{ textAlign: "justify" }}
          >
            {reply.content}
          </p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          {currentUser.role !== "Admin" && (
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[12px] font-semibold transition-all ${
                liked ? "text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#2563EB]"
              }`}
            >
              <Heart
                size={13}
                className={liked ? "fill-[#2563EB] text-[#2563EB]" : ""}
              />
              Like ({likeCount})
            </button>
          )}

          {currentUser.role === "Admin" && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF]">
              <Heart size={13} />
              Like ({likeCount})
            </span>
          )}

          {currentUser.role !== "Admin" && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF] hover:text-[#2563EB] transition"
            >
              <MessageCircle size={13} /> Reply
            </button>
          )}

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF] hover:text-[#2563EB] transition"
            >
              <Pencil size={13} /> Edit
            </button>
          )}

          {(currentUser.role === "Admin" || isMyReply) && (
            <button
              onClick={handleDeleteClick}
              disabled={currentUser.role !== "Admin" && reply.children && reply.children.length > 0}
              title={currentUser.role !== "Admin" && reply.children?.length > 0 ? "Cannot delete a reply that has responses" : ""}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-red-400 hover:text-red-600 transition ml-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>

        {showReplyInput && (
          <div className="flex gap-2 mt-3 items-center">
            <textarea
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                handleAutoGrow(e);
              }}
              placeholder="Write a reply..."
              className="flex-1 border border-[#E9F0FB] px-3 py-2 text-[12px] outline-none focus:border-[#2563EB] text-[#374151] resize-none overflow-hidden transition"
              style={{
                minHeight: "38px",
                height: "38px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                textAlign: "justify",
              }}
            />
            <button
              onClick={handleReplySubmit}
              disabled={submitting}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2 transition disabled:opacity-50 flex-shrink-0"
            >
              <Send size={13} />
            </button>
          </div>
        )}
      </div>

      {reply.children && reply.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowChildren(!showChildren)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition ml-4"
          >
            {showChildren ? (
              <>
                <ChevronUp size={14} /> Hide {reply.children.length}{" "}
                {reply.children.length === 1 ? "reply" : "replies"}
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Show {reply.children.length}{" "}
                {reply.children.length === 1 ? "reply" : "replies"}
              </>
            )}
          </button>

          {showChildren && (
            <div className="ml-4 flex flex-col gap-2 mt-2">
              {reply.children.map((child) => (
                <div key={child._id} className="flex items-start gap-1">
                  <div className="flex-shrink-0 mt-3">
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 3 0 L 3 9 Q 3 13 7 13 L 14 13"
                        stroke="#C7D7FD"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 11 10 L 15 13 L 11 16"
                        stroke="#C7D7FD"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <ChildReplyItem
                      reply={child}
                      postId={postId}
                      currentUser={currentUser}
                      onReplyAdded={onReplyAdded}
                      onDeleteReply={onDeleteReply}
                      onEditReply={onEditReply}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReplyItem = ({
  reply,
  postId,
  currentUser,
  onReplyAdded,
  onDeleteReply,
  onEditReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showChildren, setShowChildren] = useState(false);

  let initialLiked = false;
  if (reply.likes && currentUser && currentUser._id) {
    for (let i = 0; i < reply.likes.length; i++) {
      if (reply.likes[i].toString() === currentUser._id.toString()) {
        initialLiked = true;
        break;
      }
    }
  }

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(
    reply.likes ? reply.likes.length : 0,
  );
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const isMyReply =
    reply.authorId && currentUser && currentUser._id
      ? reply.authorId.toString() === currentUser._id.toString()
      : false;

  const canEdit =
    isMyReply &&
    isWithinTenMinutes(reply.createdAt) &&
    currentUser.role !== "Admin";

  const handleLike = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${postId}/reply/${reply._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLikeCount(res.data.likesCount);
      setLiked(!liked);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.post(
        `/forum/${postId}/reply`,
        { content: replyText, parentReplyId: reply._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onReplyAdded(res.data.post.replies);
      setReplyText("");
      setShowReplyInput(false);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editText.trim()) return;
    try {
      setEditSubmitting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${postId}/reply/${reply._id}/edit`,
        { content: editText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onEditReply(res.data.post.replies);
      setIsEditing(false);
    } catch (err) {
      console.log("Edit error:", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reply?",
    );
    if (confirmed) {
      onDeleteReply(reply._id);
    }
  };

  const handleAutoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-[#F8FAFF] p-4 border border-[#E9F0FB]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar
              role={reply.authorRole}
              photo={reply.authorPhoto}
              name={reply.authorName}
            />
            <div>
              {reply.authorRole === "Counselor" ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-[#111827]">
                    {reply.authorName}
                  </p>
                  <span className="text-[11px] bg-[#EEF2FF] text-[#2563EB] font-bold px-2 py-0.5 border border-[#C7D7FD]">
                    Verified Counselor
                  </span>
                </div>
              ) : (
                <p className="text-[13px] font-semibold text-[#111827]">
                  Anonymous Student
                </p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-[#9CA3AF]">
            {timeAgo(reply.createdAt)}
          </p>
        </div>

        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                handleAutoGrow(e);
              }}
              className="w-full border border-[#2563EB] px-3 py-2 text-[13px] text-[#374151] outline-none resize-none overflow-hidden"
              style={{
                minHeight: "72px",
                height: "72px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEditSubmit}
                disabled={editSubmitting}
                className="flex items-center gap-1 bg-[#2563EB] text-white text-[12px] font-semibold px-3 py-1.5 hover:bg-[#1D4ED8] transition"
              >
                <Check size={12} />
                {editSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(reply.content);
                }}
                className="flex items-center gap-1 bg-[#F3F4F6] text-[#374151] text-[12px] font-semibold px-3 py-1.5 hover:bg-[#E5E7EB] transition"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className="text-[13px] text-[#374151] leading-relaxed mb-3 whitespace-pre-wrap"
            style={{ textAlign: "justify" }}
          >
            {reply.content}
          </p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          {currentUser.role !== "Admin" && (
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[12px] font-semibold transition-all ${
                liked ? "text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#2563EB]"
              }`}
            >
              <Heart
                size={13}
                className={liked ? "fill-[#2563EB] text-[#2563EB]" : ""}
              />
              Like ({likeCount})
            </button>
          )}

          {currentUser.role === "Admin" && (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF]">
              <Heart size={13} />
              Like ({likeCount})
            </span>
          )}

          {currentUser.role !== "Admin" && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF] hover:text-[#2563EB] transition"
            >
              <MessageCircle size={13} /> Reply
            </button>
          )}

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF] hover:text-[#2563EB] transition"
            >
              <Pencil size={13} /> Edit
            </button>
          )}

          {(currentUser.role === "Admin" || isMyReply) && (
            <button
              onClick={handleDeleteClick}
              disabled={currentUser.role !== "Admin" && reply.children && reply.children.length > 0}
              title={currentUser.role !== "Admin" && reply.children?.length > 0 ? "Cannot delete a reply that has responses" : ""}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-red-400 hover:text-red-600 transition ml-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>

        {showReplyInput && (
          <div className="flex gap-2 mt-3 items-center">
            <textarea
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                handleAutoGrow(e);
              }}
              placeholder="Write a reply..."
              className="flex-1 border border-[#E9F0FB] px-3 py-2 text-[12px] outline-none focus:border-[#2563EB] text-[#374151] resize-none overflow-hidden transition"
              style={{
                minHeight: "38px",
                height: "38px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                textAlign: "justify",
              }}
            />
            <button
              onClick={handleReplySubmit}
              disabled={submitting}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2 transition disabled:opacity-50 flex-shrink-0"
            >
              <Send size={13} />
            </button>
          </div>
        )}
      </div>

      {reply.children && reply.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowChildren(!showChildren)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition ml-4"
          >
            {showChildren ? (
              <>
                <ChevronUp size={14} /> Hide {reply.children.length}{" "}
                {reply.children.length === 1 ? "reply" : "replies"}
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Show {reply.children.length}{" "}
                {reply.children.length === 1 ? "reply" : "replies"}
              </>
            )}
          </button>

          {showChildren && (
            <div className="ml-4 flex flex-col gap-2 mt-2">
              {reply.children.map((child) => (
                <div key={child._id} className="flex items-start gap-1">
                  <div className="flex-shrink-0 mt-3">
                    <svg
                      width="20"
                      height="16"
                      viewBox="0 0 20 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 3 0 L 3 9 Q 3 13 7 13 L 14 13"
                        stroke="#C7D7FD"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 11 10 L 15 13 L 11 16"
                        stroke="#C7D7FD"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <ChildReplyItem
                      reply={child}
                      postId={postId}
                      currentUser={currentUser}
                      onReplyAdded={onReplyAdded}
                      onDeleteReply={onDeleteReply}
                      onEditReply={onEditReply}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;