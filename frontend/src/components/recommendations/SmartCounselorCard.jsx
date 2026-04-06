import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const VISIBLE_TAGS = 2;

function SpecializationTags({ specialization }) {
  const [expanded, setExpanded] = useState(false);

  if (!specialization) return null;

  const allTags = specialization.split(",");
  const tags = [];
  for (let i = 0; i < allTags.length; i++) {
    const trimmed = allTags[i].trim();
    if (trimmed) {
      tags.push(trimmed);
    }
  }

  if (tags.length === 0) return null;

  let visible = [];
  if (expanded) {
    for (let i = 0; i < tags.length; i++) {
      visible.push(tags[i]);
    }
  } else {
    for (let i = 0; i < VISIBLE_TAGS && i < tags.length; i++) {
      visible.push(tags[i]);
    }
  }

  const remaining = tags.length - VISIBLE_TAGS;

  function handleExpand() {
    setExpanded(true);
  }

  function handleCollapse() {
    setExpanded(false);
  }

  let showExpandButton = false;
  if (!expanded && remaining > 0) {
    showExpandButton = true;
  }

  let showCollapseButton = false;
  if (expanded && tags.length > VISIBLE_TAGS) {
    showCollapseButton = true;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map(function (tag, i) {
        return (
          <span
            key={i}
            className="text-[13px] bg-gray-100 text-gray-500 px-2.5 py-0.5"
          >
            {tag}
          </span>
        );
      })}
      {showExpandButton && (
        <button
          onClick={handleExpand}
          className="text-[13px] bg-blue-50 text-blue-500 px-2.5 py-0.5 font-semibold hover:bg-blue-100 transition"
        >
          +{remaining}
        </button>
      )}
      {showCollapseButton && (
        <button
          onClick={handleCollapse}
          className="text-[13px] bg-gray-100 text-gray-400 px-2.5 py-0.5 font-semibold hover:bg-gray-200 transition"
        >
          Show less
        </button>
      )}
    </div>
  );
}

function CounselorAvatar({ verificationPhoto, name }) {
  let hasPhoto = false;
  if (verificationPhoto) {
    hasPhoto = true;
  }

  return (
    <div className="shrink-0">
      {hasPhoto && (
        <img
          src={verificationPhoto}
          alt={name}
          className="w-13 h-13 object-cover"
          style={{ width: 52, height: 52 }}
        />
      )}
      {!hasPhoto && (
        <div
          className="bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xl"
          style={{ width: 52, height: 52 }}
        >
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
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE] p-6 text-center"
      >
        <p className="text-[14px] text-gray-400">Finding best counselors for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE] p-6 text-center"
      >
        <p className="text-[14px] text-gray-400">Could not load suggestions.</p>
      </div>
    );
  }

  let noSuggestions = false;
  if (!data) {
    noSuggestions = true;
  } else if (data.suggestions.length === 0) {
    noSuggestions = true;
  }

  if (noSuggestions) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE] p-6 text-center"
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-400">
            <Users size={20} />
          </div>
        </div>
        <p className="text-[14px] text-gray-500">No available counselors found right now.</p>
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start"
    >
      {data.suggestions.map(function (counselor, index) {
        const isBestMatch = index === 0;

        let hasBio = false;
        if (counselor.bio) {
          hasBio = true;
        }

        let hasProfTitle = false;
        if (counselor.profTitle) {
          hasProfTitle = true;
        }

        function handleView() {
          navigate("/counselor/" + counselor._id);
        }

        return (
          <div
            key={counselor._id}
            className="bg-white border border-[#DBEAFE] p-5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <CounselorAvatar
                verificationPhoto={counselor.verificationPhoto}
                name={counselor.name}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-black text-gray-800 truncate">
                  {counselor.name}
                </p>
                {hasProfTitle && (
                  <p className="text-[13px] text-gray-400">{counselor.profTitle}</p>
                )}
              </div>
              {isBestMatch && (
                <span className="text-[12px] bg-blue-50 text-blue-600 font-black px-2.5 py-0.5 shrink-0">
                  Best Match
                </span>
              )}
            </div>

            <SpecializationTags specialization={counselor.specialization} />

            {hasBio && (
              <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                {counselor.bio}
              </p>
            )}

            <p className="text-[13px] text-blue-600 font-semibold">
              {counselor.matchReason}
            </p>

            <button
              onClick={handleView}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-black py-2.5 transition mt-auto"
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