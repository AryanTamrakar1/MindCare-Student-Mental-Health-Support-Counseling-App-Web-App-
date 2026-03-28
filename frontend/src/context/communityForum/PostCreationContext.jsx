import { createContext, useContext, useState } from "react";
import API from "../../api/axios";
import { useCommunityForumContext } from "./CommunityForumContext";

const PostCreationContext = createContext(null);

export const PostCreationProvider = ({ children }) => {
  const { posts, setPosts } = useCommunityForumContext();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newMoodTag, setNewMoodTag] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !newCategory || !newMoodTag) {
      setPostError("Please fill in all fields.");
      return;
    }
    try {
      setPosting(true);
      const token = sessionStorage.getItem("token");
      const res = await API.post(
        "/forum",
        { title: newTitle, content: newContent, category: newCategory, moodTag: newMoodTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data.post, ...posts]);
      setNewTitle("");
      setNewContent("");
      setNewCategory("");
      setNewMoodTag("");
      setIsExpanded(false);
      setPostError("");
    } catch {
      setPostError("Something went wrong. Try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleTextareaInput = (e) => {
    setNewContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <PostCreationContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        newTitle,
        setNewTitle,
        newContent,
        setNewContent,
        newCategory,
        setNewCategory,
        newMoodTag,
        setNewMoodTag,
        posting,
        postError,
        handleCreatePost,
        handleTextareaInput,
      }}
    >
      {children}
    </PostCreationContext.Provider>
  );
};

export const usePostCreationContext = () => {
  const ctx = useContext(PostCreationContext);
  if (!ctx)
    throw new Error(
      "usePostCreationContext must be used inside PostCreationProvider"
    );
  return ctx;
};