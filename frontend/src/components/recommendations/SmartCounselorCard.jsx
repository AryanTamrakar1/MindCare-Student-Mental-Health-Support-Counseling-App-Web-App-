import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const VISIBLE_TAGS = 2;

function SpecializationTags({ specialization }) {
  const [expanded, setExpanded] = useState(false);

  if (!specialization) return null;

  const tags = specialization
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tags.length === 0) return null;

  let visible = tags.slice(0, VISIBLE_TAGS);
  if (expanded) visible = tags;
  const remaining = tags.length - VISIBLE_TAGS;

  function handleExpand() {
    setExpanded(true);
  }

  function handleCollapse() {
    setExpanded(false);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map(function (tag, i) {
        return (
          <span
            key={i}
            className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        );
      })}
      {!expanded && remaining > 0 && (
        <button
          onClick={handleExpand}
          className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full font-semibold hover:bg-indigo-100 transition"
        >
          +{remaining}
        </button>
      )}
      {expanded && tags.length > VISIBLE_TAGS && (
        <button
          onClick={handleCollapse}
          className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Show less
        </button>
      )}
    </div>
  );
}

function CounselorAvatar({ verificationPhoto, name }) {
  const hasPhoto = verificationPhoto;

  return (
    <div className="shrink-0">
      {hasPhoto && (
        <img
          src={
            "http://127.0.0.1:5050/uploads/verifications/" + verificationPhoto
          }
          alt={name}
          className="w-12 h-12 rounded-xl object-cover"
        />
      )}
      {!hasPhoto && (
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-lg">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}

const SmartCounselorCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/counselor-match", {
          headers: { Authorization: "Bearer " + token },
        });
        setData(res.data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
        <p className="text-sm text-gray-400">
          Finding best counselors for you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
        <p className="text-sm text-gray-400">Could not load suggestions.</p>
      </div>
    );
  }

  const noSuggestions = !data || data.suggestions.length === 0;

  if (noSuggestions) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-black/10 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <Users size={20} />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          No available counselors found right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      {data.suggestions.map(function (counselor, index) {
        const isBestMatch = index === 0;
        const hasBio = counselor.bio;
        const hasProfTitle = counselor.profTitle;

        function handleView() {
          navigate("/counselor/" + counselor._id);
        }

        return (
          <div
            key={counselor._id}
            className="bg-white rounded-2xl border border-black/10 p-5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <CounselorAvatar
                verificationPhoto={counselor.verificationPhoto}
                name={counselor.name}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-gray-800 truncate">
                  {counselor.name}
                </p>
                {hasProfTitle && (
                  <p className="text-xs text-gray-400">{counselor.profTitle}</p>
                )}
              </div>
              {isBestMatch && (
                <span className="text-xs bg-indigo-50 text-indigo-600 font-black px-2 py-0.5 rounded-full shrink-0">
                  Best Match
                </span>
              )}
            </div>

            <SpecializationTags specialization={counselor.specialization} />

            {hasBio && (
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {counselor.bio}
              </p>
            )}

            <p className="text-xs text-indigo-600 font-semibold">
              {counselor.matchReason}
            </p>

            <button
              onClick={handleView}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black py-2.5 rounded-xl transition mt-auto"
            >
              View Profile
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SmartCounselorCard;
