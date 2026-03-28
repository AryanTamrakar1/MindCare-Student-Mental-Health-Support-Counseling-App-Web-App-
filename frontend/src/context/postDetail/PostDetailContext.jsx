import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const PostDetailContext = createContext(null);

export const PostDetailProvider = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [iFeelCount, setIFeelCount] = useState(0);
  const [iClicked, setIClicked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [allReplies, setAllReplies] = useState([]);
  const [showReplyArea, setShowReplyArea] = useState(false);

  let backPath = "/community-forum";
  let backLabel = "Back to Forum";
  if (user && user.role === "Admin") {
    backPath = "/post-management";
    backLabel = "Back to Post Management";
  }

  useEffect(
    function () {
      fetchPost();
    },
    [id],
  );

  const fetchPost = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/forum/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      setPost(res.data);
      setAllReplies(res.data.replies || []);
      setIFeelCount(res.data.iFeelThis.length);

      const iFeelIds = res.data.iFeelThis;
      let clicked = false;
      if (user && user._id) {
        for (let i = 0; i < iFeelIds.length; i++) {
          if (iFeelIds[i].toString() === user._id.toString()) {
            clicked = true;
          }
        }
      }
      setIClicked(clicked);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleIFeelThis = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.put(
        "/forum/" + id + "/ifeelthis",
        {},
        {
          headers: { Authorization: "Bearer " + token },
        },
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
        "/forum/" + id + "/reply",
        { content: replyText },
        { headers: { Authorization: "Bearer " + token } },
      );
      setAllReplies(res.data.post.replies);
      setReplyText("");
    } catch (err) {
      console.log("Error:", err);
    }
    setSubmitting(false);
  };

  const handleReplyGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete("/forum/" + id + "/reply/" + replyId, {
        headers: { Authorization: "Bearer " + token },
      });
      const updated = [];
      for (let i = 0; i < allReplies.length; i++) {
        const r = allReplies[i];
        const parentId = r.parentReplyId ? r.parentReplyId.toString() : null;
        if (r._id !== replyId && parentId !== replyId) {
          updated.push(r);
        }
      }
      setAllReplies(updated);
      alert("Reply deleted successfully!"); 
    } catch (err) {
      console.log("Error:", err);
      alert("Failed to delete reply. Please try again."); 
    }
  };

  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post and all its replies?",
      )
    )
      return;
    try {
      const token = sessionStorage.getItem("token");
      await API.delete("/forum/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      alert("Post deleted successfully!");
      navigate(backPath);
    } catch (err) {
      console.log("Error:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const buildTree = (replies) => {
    const map = {};
    for (let i = 0; i < replies.length; i++) {
      const r = replies[i];
      map[r._id] = { ...r, children: [] };
    }
    const roots = [];
    for (let i = 0; i < replies.length; i++) {
      const r = replies[i];
      if (r.parentReplyId && map[r.parentReplyId]) {
        map[r.parentReplyId].children.push(map[r._id]);
      } else if (!r.parentReplyId) {
        roots.push(map[r._id]);
      }
    }
    return roots;
  };

  let isMyPost = false;
  if (post && post.authorId && user && user._id) {
    if (post.authorId.toString() === user._id.toString()) {
      isMyPost = true;
    }
  }

  const replyTree = buildTree(allReplies);

  return (
    <PostDetailContext.Provider
      value={{
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
      }}
    >
      {children}
    </PostDetailContext.Provider>
  );
};

export const usePostDetailContext = () => {
  const ctx = useContext(PostDetailContext);
  if (!ctx)
    throw new Error(
      "usePostDetailContext must be used inside PostDetailProvider",
    );
  return ctx;
};
