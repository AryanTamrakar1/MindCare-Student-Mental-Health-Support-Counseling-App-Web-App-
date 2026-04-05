import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  CalendarCheck,
  Star,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import PlatformChartCard from "../components/analytics/PlatformChartCard";
import {
  AdminDashboardProvider,
  useAdminDashboardContext,
} from "../context/adminDashboard/adminDashboardContext";
import { useadminDashboard } from "../hooks/adminDashboard/useadminDashboard";

const StatCard = ({ label, value, icon: Icon, accent }) => {
  const map = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconColor: "text-blue-500",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      iconColor: "text-emerald-500",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-100",
      iconColor: "text-violet-500",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconColor: "text-amber-500",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      iconColor: "text-rose-500",
    },
  };
  const c = map[accent];
  return (
    <div
      className="bg-white border border-[#DBEAFE] px-6 py-5 flex items-center gap-5 hover:shadow-sm transition-all duration-200"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className={`w-12 h-12 ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={22} className={c.iconColor} strokeWidth={2} />
      </div>
      <div>
        <p className="text-[28px] font-bold text-[#111827] leading-none">
          {value}
        </p>
        <p className="text-[13px] font-medium text-[#6B7280] mt-1.5">{label}</p>
      </div>
    </div>
  );
};

function getProfilePhotoUrl(u) {
  if (u.verificationPhoto)
    return "http://127.0.0.1:5050/uploads/verifications/" + u.verificationPhoto;
  return (
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(u.name || "User") +
    "&background=2563EB&color=fff&size=200"
  );
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  const s =
    day > 3 && day < 21
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  return `${day}${s} ${month}, ${year}`;
}

const columns = "44px 1px 2.2fr 1px 2fr 1px 1.2fr 1px 1.4fr 1px 1.6fr";

const RecentUsersCard = ({ users, onRemove }) => {
  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 gap-2">
        <Users size={24} className="text-[#E5E7EB]" />
        <p className="text-[13px] font-medium text-[#9CA3AF]">No users yet</p>
      </div>
    );
  }

  return (
    <div
      className="border border-[#E5E9F2] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="grid bg-[#F9FAFB] border-b border-[#E5E9F2]"
        style={{ gridTemplateColumns: columns }}
      >
        <div className="px-4 py-3 flex items-center">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
            #
          </span>
        </div>
        {["Name", "Email", "Role", "Joined", "Action"].map((label) => (
          <React.Fragment key={label}>
            <div className="bg-[#E5E9F2]" />
            <div className="px-5 py-3">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {users.map((u, i) => {
        const isStudent = u.role === "Student";
        return (
          <div
            key={u._id || i}
            className="grid border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#FAFBFE] transition-colors"
            style={{ gridTemplateColumns: columns }}
          >
            <div className="px-4 py-3.5 flex items-center">
              <span className="text-[13px] font-medium text-[#9CA3AF]">
                {i + 1}
              </span>
            </div>

            <div className="self-stretch bg-[#E5E9F2]" />
            <div className="px-5 py-3.5 flex items-center gap-2.5">
              <img
                src={getProfilePhotoUrl(u)}
                alt={u.name}
                className="border border-[#E5E7EB] flex-shrink-0"
                style={{
                  width: 34,
                  height: 34,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <p className="text-[14px] font-semibold text-[#111827] truncate">
                {u.name}
              </p>
            </div>

            <div className="self-stretch bg-[#E5E9F2]" />
            <div className="px-5 py-3.5 flex items-center">
              <p className="text-[13px] font-medium text-[#374151]">
                {u.email}
              </p>
            </div>

            <div className="self-stretch bg-[#E5E9F2]" />
            <div className="px-5 py-3.5 flex items-center">
              <span
                className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold border"
                style={{
                  ...(isStudent
                    ? {
                        background: "#EEF2FF",
                        color: "#2563EB",
                        borderColor: "#C7D2FE",
                      }
                    : {
                        background: "#F5F3FF",
                        color: "#7C3AED",
                        borderColor: "#DDD6FE",
                      }),
                }}
              >
                {u.role}
              </span>
            </div>

            <div className="self-stretch bg-[#E5E9F2]" />
            <div className="px-5 py-3.5 flex items-center">
              <p className="text-[13px] font-medium text-[#374151]">
                {formatDate(u.createdAt) || u.joinedDate || "Recently"}
              </p>
            </div>

            <div className="self-stretch bg-[#E5E9F2]" />
            <div className="px-5 py-3.5 flex items-center">
              <button
                onClick={() => onRemove && onRemove(u._id)}
                className="px-3.5 py-1.5 text-[12px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FECACA] transition-colors"
              >
                Remove Account
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const tagStyles = {
  Stress: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  Depression: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  Anxiety: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
  Career: { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
};

const PostRow = ({ post, onDelete, onView }) => {
  let previewText = post.title || "";
  if (post.content) {
    let contentPreview = post.content;
    if (contentPreview.length > 80) {
      contentPreview = contentPreview.substring(0, 80) + "…";
    }
    previewText = contentPreview;
  }

  const tag = post.category || post.tag || "General";
  const ts = tagStyles[tag] || {
    bg: "#F3F4F6",
    color: "#6B7280",
    border: "#E5E7EB",
  };
  const replies = post.replies?.length || post.replyCount || 0;

  return (
    <div
      className="flex items-start justify-between gap-4 border border-[#E5E9F2] px-5 py-4 hover:bg-[#FAFBFE] transition-colors cursor-pointer"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      onClick={onView}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 border"
            style={{
              background: ts.bg,
              color: ts.color,
              borderColor: ts.border,
            }}
          >
            {tag}
          </span>
          <span className="text-[11px] font-semibold text-[#9CA3AF]">
            Anonymous
          </span>
        </div>
        <p className="text-[13px] font-medium text-[#374151] leading-relaxed">
          "{previewText}"
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF] font-medium">
            <MessageSquare size={11} />
            {replies} {replies === 1 ? "reply" : "replies"}
          </span>
          <span className="text-[#D1D5DB]">·</span>
          <span className="text-[11px] text-[#9CA3AF] font-medium">
            {post.timeAgo || "Recently"}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete(post._id);
        }}
        className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FECACA] px-3 py-1.5 transition-colors mt-0.5"
      >
        <Trash2 size={11} />
        Delete
      </button>
    </div>
  );
};

const AdminDashboardInner = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    stats,
    recentUsers,
    posts,
    selectedYear,
    prevYear,
    nextYear,
    handleRemoveUser,
    handleDeletePost,
  } = useAdminDashboardContext();

  if (!user) {
    return null;
  }

  if (user.role !== "Admin") return null;

  const statCards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: Users,
      accent: "blue",
    },
    {
      label: "Approved Counselors",
      value: stats.counselors,
      icon: UserCheck,
      accent: "emerald",
    },
    {
      label: "Sessions Completed",
      value: stats.sessions,
      icon: CalendarCheck,
      accent: "violet",
    },
    {
      label: "Avg. Counselor Rating",
      value: parseFloat(stats.avgRating || 0).toFixed(1),
      icon: Star,
      accent: "amber",
    },
    {
      label: "Forum Posts",
      value: stats.forumPosts,
      icon: MessageSquare,
      accent: "rose",
    },
  ];

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EFF6FF] flex"
    >
      <AdminSidebar user={user} />
      <Navbar />

      <main
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{
          paddingTop: "calc(72px + 2.5rem)",
          paddingBottom: "2.5rem",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="bg-white border border-[#DBEAFE] overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-[#DBEAFE] flex items-center justify-between gap-4">
            <div className="shrink-0">
              <p className="text-[17px] font-bold text-[#0F172A]">
                Platform Activity
              </p>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Sessions completed and student registrations
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#1D4ED8] inline-block" />
                  <span className="text-[12px] font-semibold text-[#9CA3AF]">
                    Sessions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#93C5FD] inline-block" />
                  <span className="text-[12px] font-semibold text-[#9CA3AF]">
                    Students
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevYear}
                  className="w-7 h-7 flex items-center justify-center border border-[#DBEAFE] bg-[#F8FAFF] hover:bg-[#EFF6FF] text-[#2563EB] transition-colors"
                >
                  <ChevronLeft size={14} strokeWidth={2.5} />
                </button>
                <span className="text-[13px] font-bold text-[#0F172A] min-w-[48px] text-center">
                  {selectedYear}
                </span>
                <button
                  onClick={nextYear}
                  className="w-7 h-7 flex items-center justify-center border border-[#DBEAFE] bg-[#F8FAFF] hover:bg-[#EFF6FF] text-[#2563EB] transition-colors"
                >
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <PlatformChartCard selectedYear={selectedYear} />
          </div>
        </div>

        <div className="bg-white border border-[#DBEAFE] overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-[#DBEAFE] flex items-center justify-between">
            <div>
              <p className="text-[17px] font-bold text-[#0F172A]">
                Recent Users
              </p>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Latest registrations on the platform
              </p>
            </div>
            <button
              onClick={() => navigate("/user-management")}
              className="text-[13px] font-bold text-[#2563EB] bg-[#EEF2FF] hover:bg-[#DBEAFE] px-4 py-2 border border-[#C7D2FE] transition-colors"
            >
              Manage all
            </button>
          </div>
          <div className="p-6">
            <RecentUsersCard users={recentUsers} onRemove={handleRemoveUser} />
          </div>
        </div>

        <div className="bg-white border border-[#DBEAFE] overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-[#DBEAFE] flex items-center justify-between">
            <div>
              <p className="text-[17px] font-bold text-[#0F172A]">
                Post Management
              </p>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Click any post to open the forum. Anonymous community posts.
              </p>
            </div>
            <button
              onClick={() => navigate("/post-management")}
              className="text-[13px] font-bold text-[#2563EB] bg-[#EEF2FF] hover:bg-[#DBEAFE] px-4 py-2 border border-[#C7D2FE] transition-colors"
            >
              View all
            </button>
          </div>
          <div className="p-6 flex flex-col gap-2.5">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 gap-2">
                <MessageSquare size={22} className="text-[#E5E7EB]" />
                <p className="text-[13px] font-medium text-[#9CA3AF]">
                  No community posts yet
                </p>
              </div>
            ) : (
              posts.map((p) => (
                <PostRow
                  key={p._id}
                  post={p}
                  onDelete={handleDeletePost}
                  onView={() => navigate(`/post/${p._id}`)}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AdminDashboardProvider>
      <AdminDashboardInner />
    </AdminDashboardProvider>
  );
};

export default AdminDashboard;
