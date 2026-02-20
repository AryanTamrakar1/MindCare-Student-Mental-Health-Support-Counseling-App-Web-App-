import { useState } from "react";
import { Send, Trash2, CornerDownRight } from "lucide-react";
import API from "../../api/axios";

const ReplySection = ({ post, currentUser }) => {
  const [replies, setReplies] = useState(post.replies);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await API.post(
        `/forum/${post._id}/reply`,
        {
          content: replyText,
          replyToId: replyingTo ? replyingTo._id : null,
          replyToName: replyingTo ? replyingTo.displayName : null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReplies(res.data.post.replies);
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${post._id}/reply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies(replies.filter((r) => r._id !== replyId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const isMyReply = (reply) => {
    return (
      reply.authorId === currentUser._id ||
      reply.authorId?._id === currentUser._id
    );
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {replies.length === 0 ? (
        <p className="text-gray-400 text-sm mb-4">
          No replies yet. Be the first to support!
        </p>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {replies.map((reply) => (
            <div key={reply._id}>
              <div
                className={`rounded-xl p-4 border ${
                  reply.authorRole === "Counselor"
                    ? "bg-purple-50 border-purple-100"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {reply.authorRole === "Counselor" ? (
                      <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                        {reply.displayName} — Verified Counselor
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">
                        Anonymous Student
                      </span>
                    )}

                    {isMyReply(reply) && (
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        Your Reply
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentUser.role !== "Admin" && (
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo?._id === reply._id ? null : reply,
                          )
                        }
                        className="text-xs text-gray-400 hover:text-purple-600 font-bold transition-all"
                      >
                        Reply
                      </button>
                    )}

                    {currentUser.role === "Admin" && (
                      <button
                        onClick={() => setDeleteConfirmId(reply._id)}
                        className="text-red-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {reply.replyToName && (
                  <div className="flex items-center gap-1 mb-2">
                    <CornerDownRight size={12} className="text-gray-300" />
                    <span className="text-xs text-gray-400">
                      Replying to {reply.replyToName}
                    </span>
                  </div>
                )}

                <p className="text-gray-700 text-sm">{reply.content}</p>
              </div>

              {deleteConfirmId === reply._id && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
                    <h3 className="text-gray-800 text-lg font-bold mb-2">
                      Delete Reply?
                    </h3>
                    <p className="text-gray-500 text-sm mb-5">
                      This will permanently delete this reply.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteReply(reply._id)}
                        className="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {currentUser.role !== "Admin" && (
        <div>
          {replyingTo && (
            <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-4 py-2 mb-2">
              <div className="flex items-center gap-2">
                <CornerDownRight size={14} className="text-purple-400" />
                <span className="text-xs text-purple-600 font-bold">
                  Replying to {replyingTo.displayName}
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a supportive reply..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-2 text-sm outline-none placeholder-gray-400 focus:border-purple-400 transition-all"
            />
            <button
              onClick={handleReply}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplySection;
