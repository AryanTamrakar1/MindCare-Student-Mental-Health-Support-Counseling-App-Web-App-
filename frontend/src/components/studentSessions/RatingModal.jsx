import React, { useState, useEffect } from "react";
import { X, Star, CheckCircle } from "lucide-react";
import axios from "../../api/axios";
import { useStudentSessions } from "../../hooks/studentSessions/useStudentSessions";

const QUESTIONS = [
  { key: "professionalism", label: "Professionalism", description: "How professional was the counselor?" },
  { key: "clarity", label: "Clarity", description: "How clearly did the counselor communicate?" },
  { key: "empathy", label: "Empathy", description: "How empathetic did the counselor feel?" },
  { key: "helpfulness", label: "Helpfulness", description: "How helpful was the session for your concern?" },
  { key: "overallSatisfaction", label: "Overall Satisfaction", description: "Overall, how satisfied were you with this session?" },
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
          onClick={() => { if (!disabled) onChange(star); }}
          onMouseEnter={() => { if (!disabled) setHovered(star); }}
          onMouseLeave={() => { if (!disabled) setHovered(0); }}
          className={`transition-all ${disabled ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            size={26}
            className={`transition-colors ${
              star <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "fill-[#F1F5F9] text-[#F1F5F9]"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const RatingModal = () => {
  const { ratingSession: session, setRatingSession } = useStudentSessions();
  const onClose = () => setRatingSession(null);
  const onRated = () => setRatingSession(null);

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
  for (let i = 0; i < QUESTIONS.length; i++) {
    const key = QUESTIONS[i].key;
    if (ratings[key] < 1) {
      allAnswered = false;
      break;
    }
  }

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

  let titleText = "Rate Your Session";
  if (alreadyRated) {
    titleText = "Your Rating";
  }

  let showLoading = false;
  if (loading) {
    showLoading = true;
  }

  let showAlreadyRated = false;
  if (!loading && alreadyRated && !submitted) {
    showAlreadyRated = true;
  }

  let showSubmitted = false;
  if (submitted) {
    showSubmitted = true;
  }

  let showRatingForm = false;
  if (!loading && !alreadyRated && !submitted) {
    showRatingForm = true;
  }

  let buttonBg = "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed";
  if (allAnswered && !submitting) {
    buttonBg = "bg-[#2563EB] text-white hover:bg-blue-700";
  }

  let submitButtonText = "Submit Rating";
  if (submitting) {
    submitButtonText = "Submitting…";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden">

        <div className="px-7 pt-6 pb-5 flex items-start justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
              <Star size={20} className="text-yellow-500 fill-yellow-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">
                {titleText}
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                {counselorName} · {session.date}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-[#F1F5F9] flex items-center justify-center transition flex-shrink-0">
            <X size={15} className="text-[#6B7280]" strokeWidth={2} />
          </button>
        </div>

        <div className="px-7 py-6">
          {showLoading && (
            <div className="flex items-center justify-center gap-3 py-10">
              <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] text-[#94A3B8] font-medium">Loading…</span>
            </div>
          )}

          {showAlreadyRated && (
            <div className="mb-4">
              <div className="flex items-center gap-2.5 bg-blue-50 border border-[#DBEAFE] px-4 py-3 mb-5">
                <CheckCircle size={15} className="text-[#2563EB]" strokeWidth={2} />
                <p className="text-[13px] font-semibold text-[#2563EB]">You have already rated this session.</p>
              </div>
              <div className="flex flex-col gap-5">
                {QUESTIONS.map((q) => (
                  <div key={q.key} className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#111827]">{q.label}</p>
                      <p className="text-[12px] text-[#94A3B8] mt-0.5">{q.description}</p>
                    </div>
                    <StarRating value={ratings[q.key]} onChange={() => {}} disabled={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {showSubmitted && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-500" strokeWidth={2} />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#111827]">Thank you!</p>
                <p className="text-[13px] text-[#6B7280] mt-1">Your rating has been recorded.</p>
              </div>
            </div>
          )}

          {showRatingForm && (
            <div className="flex flex-col gap-5">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Rate each area from 1 to 5 stars</p>
              {QUESTIONS.map((q) => (
                <div key={q.key} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#111827]">{q.label}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">{q.description}</p>
                  </div>
                  <StarRating value={ratings[q.key]} onChange={(val) => handleStarChange(q.key, val)} disabled={false} />
                </div>
              ))}
              {error && (
                <p className="text-[12px] font-semibold text-red-500 bg-red-50 border border-red-100 px-4 py-2.5">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="px-7 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center gap-3">
            {showSubmitted || showAlreadyRated ? (
              <button onClick={onClose} className="flex-1 py-3 text-[13px] font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition">
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition ${buttonBg}`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      {submitButtonText}
                    </>
                  ) : (
                    <>
                      <Star size={14} className="fill-white text-white" strokeWidth={0} />
                      {submitButtonText}
                    </>
                  )}
                </button>
                <button onClick={onClose} className="px-5 py-3 text-[13px] font-semibold text-[#6B7280] hover:bg-[#F1F5F9] transition flex-shrink-0">
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