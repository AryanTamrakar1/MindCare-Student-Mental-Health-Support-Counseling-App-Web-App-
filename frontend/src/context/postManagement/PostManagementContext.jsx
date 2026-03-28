import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const PostManagementContext = createContext(null);

export const PostManagementProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [sortBy, setSortBy] = useState("none");
  const [filterCounselorReplied, setFilterCounselorReplied] = useState(false);
  const [filterHasReplies, setFilterHasReplies] = useState(false);

  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedMoods, setAppliedMoods] = useState([]);
  const [appliedSort, setAppliedSort] = useState("none");
  const [appliedCounselorReplied, setAppliedCounselorReplied] = useState(false);
  const [appliedHasReplies, setAppliedHasReplies] = useState(false);

  const POSTS_PER_PAGE = 4;

  useEffect(function () {
    fetchPosts();
  }, []);

  useEffect(
    function () {
      setCurrentPage(1);
    },
    [
      appliedCategories,
      appliedMoods,
      appliedSort,
      appliedCounselorReplied,
      appliedHasReplies,
      searchTerm,
    ],
  );

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/forum", {
        headers: { Authorization: "Bearer " + token },
      });
      setPosts(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post and all its replies?",
      )
    )
      return;
    try {
      const token = sessionStorage.getItem("token");
      await API.delete("/forum/" + postId, {
        headers: { Authorization: "Bearer " + token },
      });
      const updatedPosts = [];
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id !== postId) {
          updatedPosts.push(posts[i]);
        }
      }
      setPosts(updatedPosts);
      alert("Post deleted successfully!"); 
    } catch (error) {
      console.log("Error:", error);
      alert("Failed to delete post. Please try again."); 
    }
  };

  const toggleCategory = (cat) => {
    const newCategories = [];
    let found = false;
    for (let i = 0; i < selectedCategories.length; i++) {
      if (selectedCategories[i] === cat) {
        found = true;
      } else {
        newCategories.push(selectedCategories[i]);
      }
    }
    if (!found) {
      newCategories.push(cat);
    }
    setSelectedCategories(newCategories);
  };

  const toggleMood = (mood) => {
    const newMoods = [];
    let found = false;
    for (let i = 0; i < selectedMoods.length; i++) {
      if (selectedMoods[i] === mood) {
        found = true;
      } else {
        newMoods.push(selectedMoods[i]);
      }
    }
    if (!found) {
      newMoods.push(mood);
    }
    setSelectedMoods(newMoods);
  };

  const handleApplyFilter = () => {
    const catCopy = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      catCopy.push(selectedCategories[i]);
    }
    const moodCopy = [];
    for (let i = 0; i < selectedMoods.length; i++) {
      moodCopy.push(selectedMoods[i]);
    }
    setAppliedCategories(catCopy);
    setAppliedMoods(moodCopy);
    setAppliedSort(sortBy);
    setAppliedCounselorReplied(filterCounselorReplied);
    setAppliedHasReplies(filterHasReplies);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSelectedCategories([]);
    setSelectedMoods([]);
    setSortBy("none");
    setFilterCounselorReplied(false);
    setFilterHasReplies(false);
    setAppliedCategories([]);
    setAppliedMoods([]);
    setAppliedSort("none");
    setAppliedCounselorReplied(false);
    setAppliedHasReplies(false);
    setCurrentPage(1);
  };

  const filteredPosts = [];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];

    let matchesCategory = true;
    if (appliedCategories.length > 0) {
      matchesCategory = appliedCategories.includes(p.category);
    }

    let matchesMood = true;
    if (appliedMoods.length > 0) {
      matchesMood = appliedMoods.includes(p.moodTag);
    }

    let matchesSearch = true;
    if (searchTerm) {
      matchesSearch = false;
      if (
        p.content &&
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        matchesSearch = true;
      }
      if (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchesSearch = true;
      }
    }

    let matchesCounselorReplied = true;
    if (appliedCounselorReplied) {
      matchesCounselorReplied = false;
      for (let j = 0; j < p.replies.length; j++) {
        if (p.replies[j].authorRole === "Counselor") {
          matchesCounselorReplied = true;
        }
      }
    }

    let matchesHasReplies = true;
    if (appliedHasReplies) {
      matchesHasReplies = p.replies.length > 0;
    }

    if (
      matchesCategory &&
      matchesMood &&
      matchesSearch &&
      matchesCounselorReplied &&
      matchesHasReplies
    ) {
      filteredPosts.push(p);
    }
  }

  filteredPosts.sort(function (a, b) {
    if (appliedSort === "most-liked") {
      return b.iFeelThis.length - a.iFeelThis.length;
    }
    if (appliedSort === "most-commented") {
      return b.replies.length - a.replies.length;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = [];
  for (let i = startIndex; i < endIndex && i < filteredPosts.length; i++) {
    paginatedPosts.push(filteredPosts[i]);
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  let totalReplies = 0;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].replies) {
      totalReplies = totalReplies + posts[i].replies.length;
    }
  }

  const isFiltered =
    appliedCategories.length > 0 ||
    appliedMoods.length > 0 ||
    appliedSort !== "none" ||
    appliedCounselorReplied ||
    appliedHasReplies;

  return (
    <PostManagementContext.Provider
      value={{
        posts,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        selectedCategories,
        setSelectedCategories,
        selectedMoods,
        setSelectedMoods,
        sortBy,
        setSortBy,
        filterCounselorReplied,
        setFilterCounselorReplied,
        filterHasReplies,
        setFilterHasReplies,
        appliedCategories,
        appliedMoods,
        appliedSort,
        appliedCounselorReplied,
        appliedHasReplies,
        toggleCategory,
        toggleMood,
        handleApplyFilter,
        handleClearFilter,
        handleDeletePost,
        filteredPosts,
        paginatedPosts,
        pageNumbers,
        totalPages,
        totalReplies,
        isFiltered,
      }}
    >
      {children}
    </PostManagementContext.Provider>
  );
};

export const usePostManagementContext = () => {
  const ctx = useContext(PostManagementContext);
  if (!ctx)
    throw new Error(
      "usePostManagementContext must be used inside PostManagementProvider",
    );
  return ctx;
};
