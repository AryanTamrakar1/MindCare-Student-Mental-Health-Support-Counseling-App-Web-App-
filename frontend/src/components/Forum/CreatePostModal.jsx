import { useState } from "react";
import { X } from "lucide-react";
import API from "../../api/axios";

const categories = [
  "Academic & Exam Pressure",
  "Skill Gap & Job Anxiety",
  "Family & Social Pressure",
  "Emotional & Personal Issues",
  "Sleep & Physical Wellbeing",
  "General Mental Health",
];

const moodTags = [
  { label: "Overwhelmed", emoji: "😰" },
  { label: "Struggling", emoji: "😞" },
  { label: "Confused", emoji: "😕" },
  { label: "Frustrated", emoji: "😤" },
  { label: "Hopeful", emoji: "🙂" },
];

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [moodTag, setMoodTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || !category || !moodTag) {
      setError("Please fill in all fields before posting.");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await API.post(
        "/forum",
        { content, category, moodTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onPostCreated(res.data.post);
      onClose();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-xl font-bold">Share Your Thoughts</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="bg-[#374151] rounded-xl px-4 py-2 mb-4">
          <p className="text-[#9ca3af] text-sm">
            🔒 Your post is <span className="text-white font-bold">completely anonymous</span>. No one will know it's you.
          </p>
        </div>

        <div className="mb-4">
          <label className="text-[#9ca3af] text-sm font-bold mb-2 block">
            What is your post about?
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-sm px-3 py-2 rounded-xl font-bold transition-all ${
                  category === cat
                    ? "bg-[#4f46e5] text-white"
                    : "bg-[#374151] text-[#9ca3af] hover:bg-[#4b5563] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[#9ca3af] text-sm font-bold mb-2 block">
            How are you feeling right now?
          </label>
          <div className="flex flex-wrap gap-2">
            {moodTags.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setMoodTag(mood.label)}
                className={`text-sm px-3 py-2 rounded-xl font-bold transition-all ${
                  moodTag === mood.label
                    ? "bg-[#4f46e5] text-white"
                    : "bg-[#374151] text-[#9ca3af] hover:bg-[#4b5563] hover:text-white"
                }`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[#9ca3af] text-sm font-bold mb-2 block">
            What's on your mind?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share what you're going through. This is a safe space..."
            rows={4}
            className="w-full bg-[#374151] text-white rounded-xl px-4 py-3 text-sm outline-none placeholder-[#6b7280] resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#4f46e5] text-white font-bold py-3 rounded-xl hover:bg-[#4338ca] transition-all disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Anonymously"}
        </button>

      </div>
    </div>
  );
};

export default CreatePostModal;