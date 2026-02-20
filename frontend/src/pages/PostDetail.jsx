import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import StudentSidebar from "../components/StudentSidebar";
import CounselorSidebar from "../components/CounselorSidebar";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

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

const isWithinTenMinutes = (date) =>
  Date.now() - new Date(date).getTime() < 10 * 60 * 1000;

const buildTree = (replies) => {
  const map = {};
  replies.forEach((r) => {
    map[r._id] = { ...r, children: [] };
  });
  const roots = [];
  replies.forEach((r) => {
    if (r.parentReplyId && map[r.parentReplyId]) {
      map[r.parentReplyId].children.push(map[r._id]);
    } else if (!r.parentReplyId) {
      roots.push(map[r._id]);
    }
  });
  return roots;
};

const Avatar = ({ role, photo, name }) => {
  if (role === "Counselor" && photo)
    return (
      <img
        src={`http://127.0.0.1:5050/uploads/verifications/${photo}`}
        alt={name}
        className="w-8 h-8 rounded-full border-2 border-indigo-200 object-cover flex-shrink-0"
      />
    );
  if (role === "Counselor")
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
        <span className="text-indigo-600 font-black text-sm">
          {name?.charAt(0) || "C"}
        </span>
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <svg
        className="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
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
  const childReplies = reply.children || [];

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
    } catch (error) {
      console.log("Error:", error);
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
    } catch (error) {
      console.log("Error:", error);
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
    } catch (error) {
      console.log("Edit error:", error);
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
                <X size={12} />
                Cancel
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
              <MessageCircle size={13} />
              Reply
            </button>
          )}
          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-500 transition"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}
          {currentUser?.role === "Admin" && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 transition ml-auto"
            >
              <Trash2 size={13} />
              Delete
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

      {childReplies.length > 0 && (
        <div className="mt-1 ml-4">
          {childReplies.map((child) => (
            <div key={child._id} className="flex items-start">
              <div
                className="flex-shrink-0"
                style={{ width: 24, marginTop: 20 }}
              >
                <svg
                  width="24"
                  height="20"
                  viewBox="0 0 24 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iFeelCount, setIFeelCount] = useState(0);
  const [iClicked, setIClicked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [allReplies, setAllReplies] = useState([]);
  const [showReplyArea, setShowReplyArea] = useState(false);

  const backPath =
    user?.role === "Admin" ? "/post-management" : "/community-forum";
  const backLabel =
    user?.role === "Admin" ? "Back to Post Management" : "Back to Forum";

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get(`/forum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(res.data);
      setAllReplies(res.data.replies || []);
      setIFeelCount(res.data.iFeelThis.length);
      setIClicked(
        res.data.iFeelThis
          .map((i) => i.toString())
          .includes(user?._id?.toString()),
      );
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIFeelThis = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        `/forum/${id}/ifeelthis`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIFeelCount(res.data.iFeelThisCount);
      setIClicked(!iClicked);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleTopLevelReply = async () => {
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.post(
        `/forum/${id}/reply`,
        { content: replyText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAllReplies(res.data.post.replies);
      setReplyText("");
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${id}/reply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllReplies((prev) =>
        prev.filter(
          (r) => r._id !== replyId && r.parentReplyId?.toString() !== replyId,
        ),
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(backPath);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const isMyPost = post?.authorId?.toString() === user?._id?.toString();
  const replyTree = buildTree(allReplies);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        {user?.role === "Student" && <StudentSidebar user={user} />}
        {user?.role === "Counselor" && <CounselorSidebar user={user} />}
        {user?.role === "Admin" && <AdminSidebar user={user} />}
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Post...
          </p>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        {user?.role === "Student" && <StudentSidebar user={user} />}
        {user?.role === "Counselor" && <CounselorSidebar user={user} />}
        {user?.role === "Admin" && <AdminSidebar user={user} />}
        <main className="flex-1 ml-[280px] flex items-center justify-center">
          <p className="text-gray-400 font-bold">Post not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {user?.role === "Student" && <StudentSidebar user={user} />}
      {user?.role === "Counselor" && <CounselorSidebar user={user} />}
      {user?.role === "Admin" && <AdminSidebar user={user} />}

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold text-sm transition"
          >
            <ArrowLeft size={18} />
            {backLabel}
          </button>
          <Navbar />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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
                <p className="text-sm font-bold text-gray-800">
                  Anonymous Student
                  {isMyPost && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 font-black px-2 py-0.5 rounded-full border border-indigo-200">
                      Your Post
                    </span>
                  )}
                </p>
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

          <h1 className="text-gray-900 font-black text-xl mb-3">
            {post.title}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-5 whitespace-pre-wrap">
            {post.content}
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            {user?.role === "Admin" ? (
              <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Heart size={15} />I feel this too ({iFeelCount})
              </span>
            ) : (
              <button
                onClick={handleIFeelThis}
                className={`flex items-center gap-2 text-xs font-bold transition-all ${iClicked ? "text-indigo-600" : "text-gray-400 hover:text-indigo-500"}`}
              >
                <Heart
                  size={15}
                  className={iClicked ? "fill-indigo-600 text-indigo-600" : ""}
                />
                I feel this too ({iFeelCount})
              </button>
            )}
            <button
              onClick={() => setShowReplyArea(!showReplyArea)}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-500 transition"
            >
              <MessageCircle size={15} />
              Replies ({replyTree.length})
            </button>
            {(user?.role === "Admin" || isMyPost) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-auto flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={15} />
                Delete Post
              </button>
            )}
          </div>

          {showReplyArea && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              {user?.role !== "Admin" && (
                <div className="flex gap-3 mb-5 pb-5 border-b border-gray-100">
                  {user?.role === "Counselor" && user?.verificationPhoto ? (
                    <img
                      src={`http://127.0.0.1:5050/uploads/verifications/${user.verificationPhoto}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border-2 border-indigo-200 object-cover flex-shrink-0"
                    />
                  ) : user?.role === "Counselor" ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-black text-sm">
                        {user?.name?.charAt(0) || "C"}
                      </span>
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  )}
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      user?.role === "Counselor"
                        ? "Reply as a verified counselor..."
                        : "Write a supportive reply anonymously..."
                    }
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 text-gray-700"
                  />
                  <button
                    onClick={handleTopLevelReply}
                    disabled={submitting}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              )}

              {replyTree.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No replies yet. Be the first to support!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {replyTree.map((reply) => (
                    <ReplyItem
                      key={reply._id}
                      reply={reply}
                      postId={id}
                      currentUser={user}
                      onReplyAdded={(newReplies) => setAllReplies(newReplies)}
                      onDeleteReply={handleDeleteReply}
                      onEditReply={(newReplies) => setAllReplies(newReplies)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-gray-800 font-black text-lg mb-2">
              Delete Post?
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              This will permanently delete the post and all replies.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
