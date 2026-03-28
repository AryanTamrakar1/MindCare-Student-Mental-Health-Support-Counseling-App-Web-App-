import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const AdminDashboardContext = createContext(null);

export const AdminDashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    students: 0,
    counselors: 0,
    sessions: 0,
    avgRating: 0,
    forumPosts: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  function prevYear() {
    setSelectedYear(selectedYear - 1);
  }

  function nextYear() {
    setSelectedYear(selectedYear + 1);
  }

  useEffect(function () {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: "Bearer " + token };

      const userRes = await API.get("/admin/all-users", { headers });
      const postRes = await API.get("/forum", { headers });
      const overviewRes = await API.get("/analytics/overview", { headers });

      const allUsers = userRes.data || [];
      let students = 0;
      let counselors = 0;
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].role === "Student") {
          students = students + 1;
        }
        if (allUsers[i].role === "Counselor") {
          counselors = counselors + 1;
        }
      }

      const reversedUsers = [];
      for (let i = allUsers.length - 1; i >= 0; i--) {
        reversedUsers.push(allUsers[i]);
      }
      const recent = [];
      for (let i = 0; i < reversedUsers.length && i < 6; i++) {
        const u = reversedUsers[i];
        let joinedDate = "Recently";
        if (u.createdAt) {
          joinedDate = new Date(u.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
        recent.push({ ...u, joinedDate: joinedDate });
      }

      const allPosts = postRes.data || [];
      const reversedPosts = [];
      for (let i = allPosts.length - 1; i >= 0; i--) {
        reversedPosts.push(allPosts[i]);
      }
      const recentPosts = [];
      for (let i = 0; i < reversedPosts.length && i < 4; i++) {
        const p = reversedPosts[i];
        let timeAgoStr = "Recently";
        if (p.createdAt) {
          timeAgoStr = timeAgo(new Date(p.createdAt));
        }
        recentPosts.push({ ...p, timeAgo: timeAgoStr });
      }

      setStats({
        students,
        counselors,
        sessions: overviewRes.data.totalSessions || 0,
        avgRating: overviewRes.data.averageRating || 0,
        forumPosts: allPosts.length,
      });
      setRecentUsers(recent);
      setPosts(recentPosts);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data");
      setStats({
        students: 0,
        counselors: 0,
        sessions: 0,
        avgRating: 0,
        forumPosts: 0,
      });
      setRecentUsers([]);
      setPosts([]);
      setLoading(false);
    }
  };

  const handleRemoveUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this user? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await API.delete("/admin/delete-user/" + id);
      
      alert("User removed successfully");
      
      fetchAll();
    } catch (error) {
      console.error("Remove user error:", error);
      alert("Failed to remove user");
    }
  };

  const handleDeletePost = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const token = sessionStorage.getItem("token");
      await API.delete("/forum/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      
      alert("Post deleted successfully");
      
      fetchAll();
    } catch (error) {
      console.error("Delete post error:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <AdminDashboardContext.Provider
      value={{
        stats,
        recentUsers,
        posts,
        selectedYear,
        prevYear,
        nextYear,
        handleRemoveUser,
        handleDeletePost,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
};

export const useAdminDashboardContext = () => {
  const ctx = useContext(AdminDashboardContext);
  if (!ctx)
    throw new Error(
      "useAdminDashboardContext must be used inside AdminDashboardProvider"
    );
  return ctx;
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 3600) {
    return Math.floor(diff / 60) + " min ago";
  }
  if (diff < 86400) {
    return Math.floor(diff / 3600) + " hrs ago";
  }
  if (diff < 172800) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}