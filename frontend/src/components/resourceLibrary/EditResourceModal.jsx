import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import API from "../../api/axios";

function EditResourceModal({ resource, onClose, onResourceUpdated }) {
  const [title, setTitle] = useState(resource.title);
  const [link, setLink] = useState(resource.link);
  const [type, setType] = useState(resource.type || "");
  const [category, setCategory] = useState(resource.category || "");
  const [estimatedTime, setEstimatedTime] = useState(resource.estimatedTime);
  const [description, setDescription] = useState(resource.description);
  const [isPriority, setIsPriority] = useState(resource.isPriority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);

  useEffect(
    function () {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    },
    [description],
  );

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

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await API.put(
        `/resources/${resource._id}`,
        { title, link, type, category, estimatedTime, description, isPriority },
        { headers: { Authorization: "Bearer " + token } },
      );

      onResourceUpdated(response.data.resource);
      onClose();
    } catch (error) {
      setError("Failed to update resource. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Edit Resource</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-hidden flex-1"
        >
          <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={function (e) {
                  setTitle(e.target.value);
                }}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Link *
              </label>
              <input
                type="text"
                value={link}
                onChange={function (e) {
                  setLink(e.target.value);
                }}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Type
                </label>
                <select
                  value={type}
                  onChange={function (e) {
                    setType(e.target.value);
                  }}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                >
                  <option value="">None</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Estimated Time *
                </label>
                <input
                  type="text"
                  value={estimatedTime}
                  onChange={function (e) {
                    setEstimatedTime(e.target.value);
                  }}
                  placeholder="e.g. 8 min video"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={function (e) {
                  setCategory(e.target.value);
                }}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
              >
                <option value="">None</option>
                <option value="General Mental Health">
                  General Mental Health
                </option>
                <option value="Exam & Academic Pressure">
                  Exam & Academic Pressure
                </option>
                <option value="Skill Gap & Career Fear">
                  Skill Gap & Career Fear
                </option>
                <option value="Family Expectation Burden">
                  Family Expectation Burden
                </option>
                <option value="Sleep & Energy">Sleep & Energy</option>
                <option value="Social Isolation">Social Isolation</option>
                <option value="Low Motivation">Low Motivation</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Description
              </label>
              <textarea
                ref={textareaRef}
                value={description}
                onChange={function (e) {
                  setDescription(e.target.value);
                }}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPriorityEdit"
                checked={isPriority}
                onChange={function (e) {
                  setIsPriority(e.target.checked);
                }}
                className="w-4 h-4 accent-indigo-600"
              />
              <label
                htmlFor="isPriorityEdit"
                className="text-sm font-semibold text-gray-700"
              >
                Mark as Counselor Recommended
              </label>
            </div>

            {error !== "" && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
          </div>

          <div className="flex gap-3 px-6 py-5 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading === true ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditResourceModal;
