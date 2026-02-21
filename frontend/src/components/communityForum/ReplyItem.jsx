import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Pencil,
  Check,
  X,
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
  const [liked, setLiked] = useState(
    reply.likes
      ?.map((id) => id.toString())
      .includes(currentUser?._id?.toString()),
  );
  const [likeCount, setLikeCount] = useState(reply.likes?.length || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const isMyReply = reply.authorId?.toString() === currentUser?._id?.toString();
  const canEdit =
    isMyReply &&
    isWithinTenMinutes(reply.createdAt) &&
    currentUser?.role !== "Admin";

  const handleLike = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${postId}/reply/${reply._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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

  return (
    <div>
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
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
                  <p className="text-sm font-bold text-gray-800">
                    {reply.authorName}
                  </p>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-black px-2 py-0.5 rounded-full border border-indigo-200">
                    Verified Counselor
                  </span>
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-800">
                  Anonymous Student
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</p>
        </div>

        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border border-indigo-300 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEditSubmit}
                disabled={editSubmitting}
                className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                <Check size={12} />
                {editSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(reply.content);
                }}
                className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
            {reply.content}
          </p>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all ${liked ? "text-indigo-600" : "text-gray-400 hover:text-indigo-500"}`}
          >
            <Heart
              size={13}
              className={liked ? "fill-indigo-600 text-indigo-600" : ""}
            />
            Like ({likeCount})
          </button>

          {currentUser?.role !== "Admin" && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-500 transition"
            >
              <MessageCircle size={13} /> Reply
            </button>
          )}

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-500 transition"
            >
              <Pencil size={13} /> Edit
            </button>
          )}

          {currentUser?.role === "Admin" && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 transition ml-auto"
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>

        {showReplyInput && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-400 text-gray-700"
            />
            <button
              onClick={handleReplySubmit}
              disabled={submitting}
              className="bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Send size={13} />
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-gray-800 font-black text-lg mb-2">
              Delete Reply?
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              This will delete this reply and all replies to it.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteReply(reply._id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {reply.children?.length > 0 && (
        <div className="mt-1 ml-4">
          {reply.children.map((child) => (
            <div key={child._id} className="flex items-start">
              <div
                className="flex-shrink-0"
                style={{ width: 24, marginTop: 20 }}
              >
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path
                    d="M 0 0 Q 0 12 14 12"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 11 8 L 15 12 L 11 16"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 pb-3">
                <ReplyItem
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
  );
};

export default ReplyItem;
