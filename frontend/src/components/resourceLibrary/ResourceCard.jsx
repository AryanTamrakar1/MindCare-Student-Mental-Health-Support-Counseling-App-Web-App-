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
} from "lucide-react";
import API from "../../api/axios";

function ResourceCard({
  resource,
  currentUserId,
  onReactionUpdate,
  onBookmarkUpdate,
}) {
  const [loading, setLoading] = useState(false);
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

  async function handleReaction(reaction) {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await API.post(
        `/resources/${resource._id}/react`,
        { reaction: reaction },
        { headers: { Authorization: "Bearer " + token } },
      );
      onReactionUpdate(resource._id, response.data.reactions);
    } catch (error) {
      console.log("Reaction error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBookmark() {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await API.post(
        `/resources/${resource._id}/bookmark`,
        {},
        { headers: { Authorization: "Bearer " + token } },
      );
      onBookmarkUpdate(resource._id, response.data.bookmarks);
    } catch (error) {
      console.log("Bookmark error:", error);
    } finally {
      setLoading(false);
    }
  }

  function getCategoryColor(category) {
    if (category === "General Mental Health") return "bg-sky-100 text-sky-700";
    if (category === "Exam & Academic Pressure")
      return "bg-red-100 text-red-700";
    if (category === "Skill Gap & Career Fear")
      return "bg-orange-100 text-orange-700";
    if (category === "Family Expectation Burden")
      return "bg-yellow-100 text-yellow-700";
    if (category === "Sleep & Energy") return "bg-blue-100 text-blue-700";
    if (category === "Social Isolation") return "bg-purple-100 text-purple-700";
    if (category === "Low Motivation") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  }

  const descriptionLimit = 80;
  const isLongDescription = resource.description.length > descriptionLimit;
  let shortDescription = resource.description.slice(0, descriptionLimit);
  if (isLongDescription) {
    shortDescription = shortDescription + "...";
  }

  let typeBadge = null;
  if (resource.type === "Video") {
    typeBadge = (
      <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-xs font-bold">
        <Video size={12} />
        Video
      </div>
    );
  } else {
    typeBadge = (
      <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-lg text-xs font-bold">
        <BookOpen size={12} />
        Article
      </div>
    );
  }

  let typeBadgePopup = null;
  if (resource.type === "Video") {
    typeBadgePopup = (
      <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-xs font-bold">
        <Video size={12} />
        Video
      </div>
    );
  } else {
    typeBadgePopup = (
      <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-lg text-xs font-bold">
        <BookOpen size={12} />
        Article
      </div>
    );
  }

  let bookmarkFill = "none";
  if (isBookmarked) {
    bookmarkFill = "currentColor";
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow w-full">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-black text-gray-800 leading-snug flex-1">
            {resource.title}
          </h3>
          {isLongDescription && (
            <button
              onClick={function () {
                setShowPopup(true);
              }}
              className="flex-shrink-0 text-[11px] font-black text-white bg-indigo-500 hover:bg-indigo-600 transition-colors px-3 py-1.5 rounded-lg uppercase tracking-wider"
            >
              Show More
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {typeBadge}
          <span className="text-gray-300 text-xs">→</span>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${getCategoryColor(resource.category)}`}
          >
            {resource.category}
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          {resource.isPriority === true && (
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 w-fit">
              <BadgeCheck size={12} />
              Counselor Recommended
            </span>
          )}
          <p className="text-xs text-gray-400 font-medium ml-auto">
            ⏱ {resource.estimatedTime}
          </p>
        </div>

        {resource.description !== "" && (
          <p className="text-sm text-gray-500 leading-relaxed text-justify">
            {shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={function () {
                handleReaction("helpful");
              }}
              disabled={loading}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                myReaction === "helpful"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-600"
              }`}
            >
              <ThumbsUp size={12} />
              {resource.helpfulCount}
            </button>
            <button
              onClick={function () {
                handleReaction("notHelpful");
              }}
              disabled={loading}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                myReaction === "notHelpful"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-600"
              }`}
            >
              <ThumbsDown size={12} />
              {resource.notHelpfulCount}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              disabled={loading}
              className={`p-2 rounded-full border transition-all ${
                isBookmarked
                  ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                  : "bg-gray-50 text-gray-400 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
              }`}
            >
              <Bookmark size={14} fill={bookmarkFill} />
            </button>
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <ExternalLink size={12} />
              Open
            </a>
          </div>
        </div>
      </div>

      {showPopup === true && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-black text-gray-800 leading-snug flex-1">
                {resource.title}
              </h3>
              <button
                onClick={function () {
                  setShowPopup(false);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {typeBadgePopup}
                <span className="text-gray-300 text-xs">→</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${getCategoryColor(resource.category)}`}
                >
                  {resource.category}
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                {resource.isPriority === true && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 w-fit">
                    <BadgeCheck size={12} />
                    Counselor Recommended
                  </span>
                )}
                <p className="text-xs text-gray-400 font-medium ml-auto">
                  ⏱ {resource.estimatedTime}
                </p>
              </div>

              <div className="border-t border-gray-100"></div>

              <p className="text-sm text-gray-500 leading-relaxed text-justify whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex-shrink-0">
              <a
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full text-sm font-bold py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink size={14} />
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
