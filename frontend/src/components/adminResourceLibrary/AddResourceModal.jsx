import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import API from "../../api/axios";

function AddResourceModal({ onClose, onResourceAdded }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);

  useEffect(function () {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [description]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "") {
      setError("Title cannot be empty.");
      return;
    }

    if (link.startsWith("http") === false) {
      setError("Please enter a valid link starting with https://");
      return;
    }

    if (!window.confirm("Are you sure you want to add this resource?")) {
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await API.post(
        "/resources",
        { title, link, type, category, estimatedTime, description, isPriority },
        { headers: { Authorization: "Bearer " + token } }
      );

      onResourceAdded(response.data.resource);
      onClose();
    } catch (error) {
      setError("Failed to add resource. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 bg-gray-50 outline-none focus:border-blue-600 focus:bg-white transition-colors placeholder:text-gray-400";
  const labelClass = "text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-white w-full max-w-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Resource</h2>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the details to publish a new resource.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1">
          <div className="overflow-y-auto px-7 py-6 flex flex-col gap-5">

            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={function (e) {
                  setTitle(e.target.value);
                }}
                placeholder="e.g. How to manage exam stress"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Link *</label>
              <input
                type="text"
                value={link}
                onChange={function (e) {
                  setLink(e.target.value);
                }}
                placeholder="https://..."
                required
                className={inputClass}
              />
            </div>

            <div className={`grid gap-4 ${type === "Video" ? "grid-cols-2" : "grid-cols-1"}`}>
              <div>
                <label className={labelClass}>Type</label>
                <select
                  value={type}
                  onChange={function (e) {
                    setType(e.target.value);
                  }}
                  required
                  className={inputClass}
                >
                  <option value="">Select type</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                </select>
              </div>

              {type === "Video" && (
                <div>
                  <label className={labelClass}>Estimated Time *</label>
                  <input
                    type="text"
                    value={estimatedTime}
                    onChange={function (e) {
                      setEstimatedTime(e.target.value);
                    }}
                    placeholder="e.g. 8 min"
                    required
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={function (e) {
                  setCategory(e.target.value);
                }}
                required
                className={inputClass}
              >
                <option value="">Select category</option>
                <option value="General Mental Health">General Mental Health</option>
                <option value="Exam & Academic Pressure">Exam & Academic Pressure</option>
                <option value="Skill Gap & Career Fear">Skill Gap & Career Fear</option>
                <option value="Family Expectation Burden">Family Expectation Burden</option>
                <option value="Sleep & Energy">Sleep & Energy</option>
                <option value="Social Isolation">Social Isolation</option>
                <option value="Low Motivation">Low Motivation</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                ref={textareaRef}
                value={description}
                onChange={function (e) {
                  setDescription(e.target.value);
                }}
                placeholder="Short description of this resource..."
                rows={3}
                className={`${inputClass} resize-none min-h-[88px]`}
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3.5">
              <input
                type="checkbox"
                id="isPriority"
                checked={isPriority}
                onChange={function (e) {
                  setIsPriority(e.target.checked);
                }}
                className="w-4 h-4 accent-blue-600"
              />
              <div>
                <label htmlFor="isPriority" className="text-sm font-semibold text-gray-900 cursor-pointer">
                  Mark as Counselor Recommended
                </label>
                <p className="text-xs text-gray-400 mt-0.5">This resource will be highlighted for students.</p>
              </div>
            </div>

            {error !== "" && (
              <div className="bg-red-50 border border-red-300 px-4 py-3">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 px-7 py-5 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading === true ? "Adding..." : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddResourceModal;