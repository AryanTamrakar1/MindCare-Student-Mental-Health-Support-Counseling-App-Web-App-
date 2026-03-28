import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";
import { AuthContext } from "../AuthContext";

const CommunityForumContext = createContext(null);

export const CommunityForumProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
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

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    appliedCategories,
    appliedMoods,
    appliedSort,
    appliedCounselorReplied,
    appliedHasReplies,
    showMyPosts,
    searchTerm,
  ]);

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/forum", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/forum/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = [];
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id !== postId) {
          updated.push(posts[i]);
        }
      }
      setPosts(updated);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      const updated = [];
      for (let i = 0; i < selectedCategories.length; i++) {
        if (selectedCategories[i] !== cat) {
          updated.push(selectedCategories[i]);
        }
      }
      setSelectedCategories(updated);
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      const updated = [];
      for (let i = 0; i < selectedMoods.length; i++) {
        if (selectedMoods[i] !== mood) {
          updated.push(selectedMoods[i]);
        }
      }
      setSelectedMoods(updated);
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleApplyFilter = () => {
    setAppliedCategories(selectedCategories);
    setAppliedMoods(selectedMoods);
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
    setShowMyPosts(false);
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      appliedCategories.length === 0 || appliedCategories.includes(p.category);

    const matchesMood =
      appliedMoods.length === 0 || appliedMoods.includes(p.moodTag);

    const matchesMyPost =
      !showMyPosts || p.authorId?.toString() === user?._id?.toString();

    const matchesSearch =
      !searchTerm ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase());

    let hasCounselorReply = false;
    if (appliedCounselorReplied) {
      for (let i = 0; i < p.replies.length; i++) {
        if (p.replies[i].authorRole === "Counselor") {
          hasCounselorReply = true;
          break;
        }
      }
    }
    const matchesCounselorReplied = !appliedCounselorReplied || hasCounselorReply;

    const matchesHasReplies = !appliedHasReplies || p.replies.length > 0;

    return (
      matchesCategory &&
      matchesMood &&
      matchesMyPost &&
      matchesSearch &&
      matchesCounselorReplied &&
      matchesHasReplies
    );
  });

  const sortedPosts = [];
  for (let i = 0; i < filteredPosts.length; i++) {
    sortedPosts.push(filteredPosts[i]);
  }
  sortedPosts.sort((a, b) => {
    if (appliedSort === "most-liked") {
      return (b.iFeelThis?.length || 0) - (a.iFeelThis?.length || 0);
    }
    if (appliedSort === "most-commented") {
      return (b.replies?.length || 0) - (a.replies?.length || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = [];
  for (let i = startIndex; i < startIndex + POSTS_PER_PAGE; i++) {
    if (i < sortedPosts.length) {
      paginatedPosts.push(sortedPosts[i]);
    }
  }

  const isFiltered =
    appliedCategories.length > 0 ||
    appliedMoods.length > 0 ||
    appliedSort !== "none" ||
    appliedCounselorReplied ||
    appliedHasReplies ||
    showMyPosts;

  return (
    <CommunityForumContext.Provider
      value={{
        posts,
        setPosts,
        showMyPosts,
        setShowMyPosts,
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
        handleClearSearch,
        filteredPosts: sortedPosts,
        paginatedPosts,
        totalPages,
        isFiltered,
      }}
    >
      {children}
    </CommunityForumContext.Provider>
  );
};

export const useCommunityForumContext = () => {
  const ctx = useContext(CommunityForumContext);
  if (!ctx)
    throw new Error(
      "useCommunityForumContext must be used inside CommunityForumProvider"
    );
  return ctx;
};