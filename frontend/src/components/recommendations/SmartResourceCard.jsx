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
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };
    fetchSuggestions();
  }, []);

  function getTypeStyle(type) {
    if (type === "Video") return "bg-rose-50 text-rose-500 border border-rose-100";
    return "bg-sky-50 text-sky-500 border border-sky-100";
  }

  function getTypeIcon(type) {
    if (type === "Video") return Play;
    return FileText;
  }

  function getCategoryColor(category) {
    if (category === "General Mental Health") return "bg-sky-100 text-sky-700";
    if (category === "Exam & Academic Pressure") return "bg-red-100 text-red-700";
    if (category === "Skill Gap & Career Fear") return "bg-orange-100 text-orange-700";
    if (category === "Family Expectation Burden") return "bg-yellow-100 text-yellow-700";
    if (category === "Sleep & Energy") return "bg-blue-100 text-blue-700";
    if (category === "Social Isolation") return "bg-purple-100 text-purple-700";
    if (category === "Low Motivation") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-black/10 flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin shrink-0" />
        <p className="text-sm text-gray-400">Finding resources for you...</p>
      </div>
    );
  }

  if (error || !data || data.suggestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-black/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          <BookOpen size={14} />
        </div>
        <p className="text-sm text-gray-400">No recommendations available right now.</p>
      </div>
    );
  }

  const ResourceRow = ({ resource, index }) => {
    const TypeIcon = getTypeIcon(resource.type);
    const isLong = resource.description && resource.description.length > 80;

    return (
      <div className="bg-white rounded-xl border border-black/10 px-4 py-3 flex items-center gap-3 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-800 truncate mb-1">{resource.title}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {index === 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shrink-0">
                Best Match
              </span>
            )}
            <span className={"text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 " + getTypeStyle(resource.type)}>
              <TypeIcon size={9} />
              {resource.type}
            </span>
            {resource.isPriority && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center gap-1 shrink-0">
                <Flame size={9} />
                Priority
              </span>
            )}
            <span className="text-[10px] text-gray-400 shrink-0">{resource.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={11} />
            {resource.estimatedTime}
          </span>
          {isLong && (
            <button
              onClick={() => setPopupResource(resource)}
              className="text-[11px] font-bold text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-200 transition whitespace-nowrap"
            >
              Show More
            </button>
          )}
          <a
            href={resource.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap"
          >
            Open
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  };

  const rows = [];
  for (let i = 0; i < data.suggestions.length; i += 2) {
    rows.push(data.suggestions.slice(i, i + 2));
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {rows.map((pair, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 gap-2">
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
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">

            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-base font-black text-gray-800 leading-snug flex-1">
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
                  return (
                    <span className={"text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 " + getTypeStyle(popupResource.type)}>
                      <TypeIcon size={9} />
                      {popupResource.type}
                    </span>
                  );
                })()}
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getCategoryColor(popupResource.category)}`}>
                  {popupResource.category}
                </span>
                {popupResource.isPriority && (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                    <BadgeCheck size={12} />
                    Counselor Recommended
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                  <Clock size={11} />
                  {popupResource.estimatedTime}
                </span>
              </div>

              <div className="border-t border-gray-100" />

              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                {popupResource.description}
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <a
                href={popupResource.link}
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
};

export default SmartResourceCard;