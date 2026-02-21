import React, { useState, useEffect } from "react";
import { X, Star, CheckCircle } from "lucide-react";
import axios from "../../api/axios";

const QUESTIONS = [
  {
    key: "professionalism",
    label: "Professionalism",
    description: "How professional was the counselor?",
  },
  {
    key: "clarity",
    label: "Clarity",
    description: "How clearly did the counselor communicate?",
  },
  {
    key: "empathy",
    label: "Empathy",
    description: "How empathetic did the counselor feel?",
  },
  {
    key: "helpfulness",
    label: "Helpfulness",
    description: "How helpful was the session for your concern?",
  },
  {
    key: "overallSatisfaction",
    label: "Overall Satisfaction",
    description: "Overall, how satisfied were you with this session?",
  },
];

const StarRating = ({ value, onChange, disabled }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) onChange(star);
          }}
          onMouseEnter={() => {
            if (!disabled) setHovered(star);
          }}
          onMouseLeave={() => {
            if (!disabled) setHovered(0);
          }}
          className={`transition-all ${disabled ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            size={28}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const RatingModal = ({ session, onClose, onRated }) => {
  const [ratings, setRatings] = useState({
    professionalism: 0,
    clarity: 0,
    empathy: 0,
    helpfulness: 0,
    overallSatisfaction: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return;
    const checkExisting = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`/ratings/check/${session._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.hasRated) {
          setAlreadyRated(true);
          const r = res.data.rating;
          setRatings({
            professionalism: r.professionalism,
            clarity: r.clarity,
            empathy: r.empathy,
            helpfulness: r.helpfulness,
            overallSatisfaction: r.overallSatisfaction,
          });
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    checkExisting();
  }, [session._id]);

  let allAnswered = true;
  if (ratings.professionalism < 1) allAnswered = false;
  if (ratings.clarity < 1) allAnswered = false;
  if (ratings.empathy < 1) allAnswered = false;
  if (ratings.helpfulness < 1) allAnswered = false;
  if (ratings.overallSatisfaction < 1) allAnswered = false;

  const handleSubmit = async () => {
    if (!allAnswered) {
      setError("Please rate all 5 questions before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "/ratings/submit",
        {
          appointmentId: session._id,
          professionalism: ratings.professionalism,
          clarity: ratings.clarity,
          empathy: ratings.empathy,
          helpfulness: ratings.helpfulness,
          overallSatisfaction: ratings.overallSatisfaction,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSubmitted(true);
      if (onRated) onRated(session._id);
    } catch (err) {
      let message = "Could not submit rating. Try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarChange = (key, val) => {
    const updated = {
      professionalism: ratings.professionalism,
      clarity: ratings.clarity,
      empathy: ratings.empathy,
      helpfulness: ratings.helpfulness,
      overallSatisfaction: ratings.overallSatisfaction,
    };
    updated[key] = val;
    setRatings(updated);
  };

  if (!session) return null;

  let counselorName = "Counselor";
  if (session.counselorId && session.counselorId.name) {
    counselorName = session.counselorId.name;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-7 pt-6 pb-5 flex items-start justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0 border border-yellow-100">
              <Star size={22} className="text-yellow-500 fill-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {alreadyRated ? "Your Rating" : "Rate Your Session"}
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {counselorName} · {session.date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="px-7 py-6">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-10">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400 font-medium">
                Loading…
              </span>
            </div>
          )}

          {!loading && alreadyRated && !submitted && (
            <div className="mb-4">
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 mb-5">
                <CheckCircle size={16} className="text-indigo-500" />
                <p className="text-sm font-black text-indigo-700">
                  You have already rated this session.
                </p>
              </div>
              <div className="flex flex-col gap-5">
                {QUESTIONS.map((q) => (
                  <div
                    key={q.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-black text-gray-700">
                        {q.label}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {q.description}
                      </p>
                    </div>
                    <StarRating
                      value={ratings[q.key]}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {submitted && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-gray-800">Thank you!</p>
                <p className="text-sm text-gray-400 font-medium mt-1">
                  Your rating has been recorded.
                </p>
              </div>
            </div>
          )}

          {!loading && !alreadyRated && !submitted && (
            <div className="flex flex-col gap-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Rate each area from 1 to 5 stars
              </p>
              {QUESTIONS.map((q) => (
                <div
                  key={q.key}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-700">
                      {q.label}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {q.description}
                    </p>
                  </div>
                  <StarRating
                    value={ratings[q.key]}
                    onChange={(val) => handleStarChange(q.key, val)}
                    disabled={false}
                  />
                </div>
              ))}

              {error && (
                <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
            {submitted || alreadyRated ? (
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all
                    ${allAnswered && !submitting ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Star size={15} />
                      Submit Rating
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl text-xs font-black text-gray-400 hover:bg-gray-200 uppercase tracking-wider transition-colors flex-shrink-0"
                >
                  Skip
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
