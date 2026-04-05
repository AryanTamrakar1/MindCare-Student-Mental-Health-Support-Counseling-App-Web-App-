import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ExternalLink,
  Clock,
  Flame,
  Play,
  FileText,
  X,
  BadgeCheck,
} from "lucide-react";
import API from "../../api/axios";

const SmartResourceCard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [popupResource, setPopupResource] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/smart/resource-match", {
          headers: { Authorization: "Bearer " + token },
        });
        setData(res.data);
      } catch (err) {
        setError(true);
      }
    };
    fetchSuggestions();
  }, []);

  function getTypeStyle(type) {
    let style = "";
    if (type === "Video") {
      style = "bg-rose-50 text-rose-500 border border-rose-100";
    } else {
      style = "bg-sky-50 text-sky-500 border border-sky-100";
    }
    return style;
  }

  function getTypeIcon(type) {
    let icon = FileText;
    if (type === "Video") {
      icon = Play;
    }
    return icon;
  }

  function getCategoryColor(category) {
    let color = "bg-gray-100 text-gray-700";

    if (category === "General Mental Health") {
      color = "bg-sky-100 text-sky-700";
    } else if (category === "Exam & Academic Pressure") {
      color = "bg-red-100 text-red-700";
    } else if (category === "Skill Gap & Career Fear") {
      color = "bg-orange-100 text-orange-700";
    } else if (category === "Family Expectation Burden") {
      color = "bg-yellow-100 text-yellow-700";
    } else if (category === "Sleep & Energy") {
      color = "bg-blue-100 text-blue-700";
    } else if (category === "Social Isolation") {
      color = "bg-blue-100 text-blue-700";
    } else if (category === "Low Motivation") {
      color = "bg-green-100 text-green-700";
    }

    return color;
  }

  let showNoData = false;
  if (error) {
    showNoData = true;
  } else if (!data) {
    showNoData = true;
  } else if (data.suggestions.length === 0) {
    showNoData = true;
  }

  if (showNoData) {
    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE] p-4 flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          <BookOpen size={14} />
        </div>
        <p className="text-[14px] text-gray-400">No recommendations available right now.</p>
      </div>
    );
  }

  const ResourceRow = ({ resource, index }) => {
    const TypeIcon = getTypeIcon(resource.type);

    let isLong = false;
    if (resource.description && resource.description.length > 80) {
      isLong = true;
    }

    return (
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-white border border-[#DBEAFE] px-4 py-3 flex items-center gap-3 hover:border-blue-300 transition-all duration-200 min-w-0"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-black text-gray-800 truncate mb-1">{resource.title}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {index === 0 && (
              <span className="text-[11px] font-black px-2 py-0.5 bg-blue-600 text-white shrink-0">
                Best Match
              </span>
            )}
            <span className={"text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1 shrink-0 " + getTypeStyle(resource.type)}>
              <TypeIcon size={10} />
              {resource.type}
            </span>
            {resource.isPriority && (
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-500 border border-amber-100 flex items-center gap-1 shrink-0">
                <Flame size={10} />
                Priority
              </span>
            )}
            <span className="text-[11px] text-gray-400 shrink-0">{resource.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[12px] text-gray-400">
            <Clock size={12} />
            {resource.estimatedTime}
          </span>
          {isLong && (
            <button
              onClick={() => setPopupResource(resource)}
              className="text-[12px] font-bold text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-2.5 py-1.5 border border-gray-200 hover:border-blue-200 transition whitespace-nowrap"
            >
              Show More
            </button>
          )}
          <a
            href={resource.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[12px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 transition whitespace-nowrap"
          >
            Open
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    );
  };

  const rows = [];
  for (let i = 0; i < data.suggestions.length; i += 2) {
    const pair = [];
    for (let j = 0; j < 2; j++) {
      if (i + j < data.suggestions.length) {
        pair.push(data.suggestions[i + j]);
      }
    }
    rows.push(pair);
  }

  return (
    <>
      <div
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="flex flex-col gap-2"
      >
        {rows.map((pair, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 gap-2">
            {pair.map((resource, colIndex) => (
              <ResourceRow
                key={resource._id}
                resource={resource}
                index={rowIndex * 2 + colIndex}
              />
            ))}
          </div>
        ))}
      </div>

      {popupResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="bg-white w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-[17px] font-black text-gray-800 leading-snug flex-1">
                {popupResource.title}
              </h3>
              <button
                onClick={() => setPopupResource(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const TypeIcon = getTypeIcon(popupResource.type);
                  const typeStyle = getTypeStyle(popupResource.type);

                  return (
                    <span className={"text-[12px] font-semibold px-2.5 py-0.5 flex items-center gap-1 " + typeStyle}>
                      <TypeIcon size={10} />
                      {popupResource.type}
                    </span>
                  );
                })()}
                <span className={`text-[13px] font-bold px-2.5 py-1 ${getCategoryColor(popupResource.category)}`}>
                  {popupResource.category}
                </span>
                {popupResource.isPriority && (
                  <span className="flex items-center gap-1 text-[13px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700">
                    <BadgeCheck size={13} />
                    Counselor Recommended
                  </span>
                )}
                <span className="flex items-center gap-1 text-[13px] text-gray-400 ml-auto">
                  <Clock size={12} />
                  {popupResource.estimatedTime}
                </span>
              </div>

              <div className="border-t border-gray-100" />

              <p className="text-[14px] text-gray-500 leading-relaxed whitespace-pre-wrap">
                {popupResource.description}
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <a
                href={popupResource.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full text-[14px] font-bold py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
};

export default SmartResourceCard;