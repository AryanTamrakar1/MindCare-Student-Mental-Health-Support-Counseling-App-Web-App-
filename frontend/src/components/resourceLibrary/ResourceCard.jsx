import { useState } from "react";
import {
  BookOpen,
  Video,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  ExternalLink,
  BadgeCheck,
  X,
  Clock,
} from "lucide-react";
import { useResourceCard } from "../../hooks/resourceLibrary/useResourceCard";

function ResourceCard({ resource, currentUserId, onReactionUpdate, onBookmarkUpdate }) {
  const { loading, handleReaction, handleBookmark } = useResourceCard();
  const [showPopup, setShowPopup] = useState(false);

  let myReaction = null;
  for (let i = 0; i < resource.reactions.length; i++) {
    if (resource.reactions[i].studentId === currentUserId) {
      myReaction = resource.reactions[i].reaction;
      break;
    }
  }

  let isBookmarked = false;
  for (let i = 0; i < resource.bookmarks.length; i++) {
    if (resource.bookmarks[i] === currentUserId) {
      isBookmarked = true;
      break;
    }
  }

  function getCategoryColor(category) {
    let colors = { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };

    if (category === "General Mental Health") {
      colors = { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd" };
    } else if (category === "Exam & Academic Pressure") {
      colors = { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
    } else if (category === "Skill Gap & Career Fear") {
      colors = { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" };
    } else if (category === "Family Expectation Burden") {
      colors = { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
    } else if (category === "Sleep & Energy") {
      colors = { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
    } else if (category === "Social Isolation") {
      colors = { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" };
    } else if (category === "Low Motivation") {
      colors = { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
    }

    return colors;
  }

  const descriptionLimit = 80;
  let shortDescription = resource.description;
  let isLongDescription = false;

  if (resource.description.length > descriptionLimit) {
    isLongDescription = true;
    let trimmed = "";
    for (let i = 0; i < descriptionLimit; i++) {
      trimmed = trimmed + resource.description[i];
    }
    shortDescription = trimmed + "...";
  }

  const catColor = getCategoryColor(resource.category);

  let bookmarkFill = "none";
  if (isBookmarked) {
    bookmarkFill = "currentColor";
  }

  let showPopupContent = false;
  if (showPopup === true) {
    showPopupContent = true;
  }

  let showReadMoreButton = false;
  if (isLongDescription) {
    showReadMoreButton = true;
  }

  let resourceTypeIcon = BookOpen;
  let resourceTypeLabel = "Article";
  let resourceTypeColor = "#0d9488";
  let resourceTypeBg = "#f0fdfa";
  let resourceTypeBorder = "#99f6e4";

  if (resource.type === "Video") {
    resourceTypeIcon = Video;
    resourceTypeLabel = "Video";
    resourceTypeColor = "#2563EB";
    resourceTypeBg = "#EEF2FF";
    resourceTypeBorder = "#C7D2FE";
  }

  let helpfulBorder = "1px solid #E5E9F2";
  let helpfulBg = "#F9FAFB";
  let helpfulColor = "#6B7280";

  if (myReaction === "helpful") {
    helpfulBorder = "1px solid #bbf7d0";
    helpfulBg = "#f0fdf4";
    helpfulColor = "#16a34a";
  }

  let notHelpfulBorder = "1px solid #E5E9F2";
  let notHelpfulBg = "#F9FAFB";
  let notHelpfulColor = "#6B7280";

  if (myReaction === "notHelpful") {
    notHelpfulBorder = "1px solid #fecaca";
    notHelpfulBg = "#fef2f2";
    notHelpfulColor = "#dc2626";
  }

  let bookmarkBorder = "1px solid #E5E9F2";
  let bookmarkBg = "#F9FAFB";
  let bookmarkColor = "#9CA3AF";

  if (isBookmarked) {
    bookmarkBorder = "1px solid #C7D2FE";
    bookmarkBg = "#EEF2FF";
    bookmarkColor = "#2563EB";
  }

  return (
    <>
      <div
        style={{
          background: "#fff", border: "1px solid #E5E9F2",
          padding: "20px", display: "flex", flexDirection: "column", gap: "14px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C7D2FE"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E9F2"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", lineHeight: 1.4, flex: 1 }}>
            {resource.title}
          </h3>
          {showReadMoreButton && (
            <button
              onClick={function () { setShowPopup(true); }}
              style={{
                flexShrink: 0, fontSize: "11px", fontWeight: "600",
                color: "#2563EB", background: "#EEF2FF",
                border: "1px solid #C7D2FE", padding: "5px 10px",
                cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Read more
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: "600", color: resourceTypeColor,
            background: resourceTypeBg, border: `1px solid ${resourceTypeBorder}`,
            padding: "4px 10px",
          }}>
            {resourceTypeIcon === Video ? <Video size={11} strokeWidth={2} /> : <BookOpen size={11} strokeWidth={2} />}
            {resourceTypeLabel}
          </span>
          <span style={{
            fontSize: "11px", fontWeight: "600",
            color: catColor.color, background: catColor.bg,
            border: `1px solid ${catColor.border}`,
            padding: "4px 10px",
          }}>
            {resource.category}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <div>
            {resource.isPriority === true && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                fontSize: "11px", fontWeight: "600", color: "#16a34a",
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                padding: "4px 10px",
              }}>
                <BadgeCheck size={11} strokeWidth={2} />
                Counselor Recommended
              </span>
            )}
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "500", color: "#9CA3AF" }}>
            <Clock size={11} strokeWidth={2} />
            {resource.estimatedTime}
          </span>
        </div>

        {resource.description !== "" && (
          <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
            {shortDescription}
          </p>
        )}

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "12px", borderTop: "1px solid #F1F1F1", marginTop: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={function () { handleReaction(resource._id, "helpful", onReactionUpdate); }}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: "600", padding: "6px 12px",
                border: helpfulBorder,
                background: helpfulBg,
                color: helpfulColor,
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <ThumbsUp size={12} strokeWidth={2} />
              {resource.helpfulCount}
            </button>
            <button
              onClick={function () { handleReaction(resource._id, "notHelpful", onReactionUpdate); }}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: "600", padding: "6px 12px",
                border: notHelpfulBorder,
                background: notHelpfulBg,
                color: notHelpfulColor,
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <ThumbsDown size={12} strokeWidth={2} />
              {resource.notHelpfulCount}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={function () { handleBookmark(resource._id, onBookmarkUpdate); }}
              disabled={loading}
              style={{
                padding: "7px 10px",
                border: bookmarkBorder,
                background: bookmarkBg,
                color: bookmarkColor,
                cursor: "pointer",
              }}
            >
              <Bookmark size={13} strokeWidth={2} fill={bookmarkFill} />
            </button>
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: "600", padding: "7px 14px",
                background: "#2563EB", color: "#fff",
                border: "none", textDecoration: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <ExternalLink size={12} strokeWidth={2} />
              Open
            </a>
          </div>
        </div>
      </div>

      {showPopupContent && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px",
        }}>
          <div
            style={{
              background: "#fff", width: "100%", maxWidth: "640px",
              border: "1px solid #E5E9F2", overflow: "hidden",
              maxHeight: "90vh", display: "flex", flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              gap: "12px", padding: "20px 24px", borderBottom: "1px solid #E5E9F2", flexShrink: 0,
            }}>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", lineHeight: 1.4, flex: 1 }}>
                {resource.title}
              </h3>
              <button
                onClick={function () { setShowPopup(false); }}
                style={{
                  width: "30px", height: "30px", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#F3F4F6", border: "1px solid #E5E7EB",
                  color: "#9CA3AF", cursor: "pointer",
                }}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>

            <div style={{ overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "600", color: resourceTypeColor, background: resourceTypeBg, border: `1px solid ${resourceTypeBorder}`, padding: "4px 10px" }}>
                  {resourceTypeIcon === Video ? <Video size={11} strokeWidth={2} /> : <BookOpen size={11} strokeWidth={2} />}
                  {resourceTypeLabel}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: catColor.color, background: catColor.bg, border: `1px solid ${catColor.border}`, padding: "4px 10px" }}>
                  {resource.category}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                {resource.isPriority === true && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "600", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "4px 10px" }}>
                    <BadgeCheck size={11} strokeWidth={2} />
                    Counselor Recommended
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "500", color: "#9CA3AF", marginLeft: "auto" }}>
                  <Clock size={11} strokeWidth={2} />
                  {resource.estimatedTime}
                </span>
              </div>

              <div style={{ height: "1px", background: "#F1F1F1" }} />

              <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>
                {resource.description}
              </p>
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E9F2", flexShrink: 0, background: "#F9FAFB" }}>
              <a
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  width: "100%", fontSize: "14px", fontWeight: "600",
                  padding: "12px", background: "#2563EB", color: "#fff",
                  border: "none", textDecoration: "none",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <ExternalLink size={14} strokeWidth={2} />
                Open Resource
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResourceCard;