import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, ArrowLeft, Send, Trash2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import ReplyItem from "../components/communityForum/ReplyItem";



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
    } catch (err) {
      console.log("Error:", err);
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
    } catch (err) {
      console.log("Error:", err);
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
    } catch (err) {
      console.log("Error:", err);
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
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(backPath);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const isMyPost = post?.authorId?.toString() === user?._id?.toString();
  const replyTree = buildTree(allReplies);

  const SidebarComponent = () => {
    if (user?.role === "Student") return <StudentSidebar user={user} />;
    if (user?.role === "Counselor") return <CounselorSidebar user={user} />;
    if (user?.role === "Admin") return <AdminSidebar user={user} />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <SidebarComponent />
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
        <SidebarComponent />
        <main className="flex-1 ml-[280px] flex items-center justify-center">
          <p className="text-gray-400 font-bold">Post not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <SidebarComponent />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold text-sm transition"
          >
            <ArrowLeft size={18} /> {backLabel}
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
                <Heart size={15} /> I feel this too ({iFeelCount})
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
              <MessageCircle size={15} /> Replies ({replyTree.length})
            </button>

            {(user?.role === "Admin" || isMyPost) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-auto flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={15} /> Delete Post
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
