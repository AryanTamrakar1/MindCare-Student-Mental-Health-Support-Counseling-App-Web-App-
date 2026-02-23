import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import API from "../../api/axios";

const questionBank = [
  { id: 1, text: "How stressed are you this week?", category: "Stress", followUp: { question: "What is mainly causing your stress?", options: ["Exams / Assignments", "Family Pressure", "Financial Issues", "Skill Gap / Job Anxiety", "Relationships"] } },
  { id: 2, text: "How motivated do you feel this week?", category: "Motivation", followUp: { question: "What is affecting your motivation?", options: ["Lack of Interest", "Too Much Workload", "Personal Problems", "Feeling Lost About Future"] } },
  { id: 3, text: "How is your sleep quality this week?", category: "Sleep", followUp: { question: "What is disturbing your sleep?", options: ["Overthinking", "Late Night Study", "Anxiety", "Phone / Social Media"] } },
  { id: 4, text: "How anxious do you feel this week?", category: "Anxiety", followUp: { question: "What is making you anxious?", options: ["Upcoming Exams", "Career Uncertainty", "Social Situations", "Family Expectations"] } },
  { id: 5, text: "How confident are you feeling this week?", category: "Confidence", followUp: { question: "What is lowering your confidence?", options: ["Poor Academic Performance", "Skill Gap", "Comparison with Peers", "Negative Feedback"] } },
  { id: 6, text: "How happy do you feel overall this week?", category: "Happiness", followUp: { question: "What is affecting your happiness?", options: ["Loneliness", "Academic Pressure", "Personal Loss", "Feeling Stuck"] } },
  { id: 7, text: "How productive were you this week?", category: "Productivity", followUp: { question: "What stopped you from being productive?", options: ["Procrastination", "Distractions", "Low Energy", "Too Many Tasks"] } },
  { id: 8, text: "How often did you feel frustrated this week?", category: "Emotional", followUp: { question: "What frustrated you the most?", options: ["Studies", "People Around Me", "My Own Progress", "System / Institution"] } },
  { id: 9, text: "How well did you manage your emotions this week?", category: "Emotional", followUp: { question: "What made it hard to manage emotions?", options: ["Too Much Pressure", "No One to Talk To", "Bad News", "Overwhelmed by Tasks"] } },
  { id: 10, text: "How connected did you feel with your peers this week?", category: "Social", followUp: { question: "What affected your social connection?", options: ["Shyness", "Conflict with Friends", "Too Busy", "Feeling Different from Others"] } },
  { id: 11, text: "How balanced did your life feel this week?", category: "Balance", followUp: { question: "What area felt most unbalanced?", options: ["Study vs Rest", "Social vs Personal Time", "Health vs Work", "Family vs College"] } },
  { id: 12, text: "How hopeful are you about your future this week?", category: "Motivation", followUp: { question: "What is making you feel less hopeful?", options: ["Uncertain Career Path", "Skill Gap", "Financial Concerns", "Competitive Job Market"] } },
  { id: 13, text: "How physically healthy did you feel this week?", category: "Health", followUp: { question: "What affected your physical health?", options: ["Poor Diet", "No Exercise", "Irregular Sleep", "Illness"] } },
  { id: 14, text: "How focused were you during your studies this week?", category: "Productivity", followUp: { question: "What broke your focus?", options: ["Phone / Social Media", "Noisy Environment", "Anxious Thoughts", "No Clear Goal"] } },
  { id: 15, text: "How supported did you feel by your family this week?", category: "Social", followUp: { question: "What made you feel unsupported?", options: ["Pressure to Perform", "Lack of Communication", "Different Expectations", "Financial Stress at Home"] } },
  { id: 16, text: "How calm did you feel throughout this week?", category: "Anxiety", followUp: { question: "What disturbed your calmness?", options: ["Deadlines", "Unexpected Problems", "Overthinking", "Conflicts"] } },
  { id: 17, text: "How satisfied are you with your academic progress this week?", category: "Stress", followUp: { question: "What made you dissatisfied?", options: ["Poor Grades", "Not Understanding Concepts", "Falling Behind", "Comparison with Classmates"] } },
  { id: 18, text: "How energetic did you feel this week?", category: "Health", followUp: { question: "What drained your energy?", options: ["Poor Sleep", "Skipping Meals", "Too Much Screen Time", "Emotional Stress"] } },
  { id: 19, text: "How comfortable are you talking about your problems?", category: "Social", followUp: { question: "What stops you from opening up?", options: ["Fear of Judgment", "No Trusted Person", "Shame", "Don't Want to Burden Others"] } },
  { id: 20, text: "How prepared do you feel for your career this week?", category: "Skill Gap", followUp: { question: "What makes you feel unprepared?", options: ["Lack of Skills", "No Work Experience", "Unclear Career Path", "Competition from Others"] } },
  { id: 21, text: "How often did you take breaks and rest this week?", category: "Balance", followUp: { question: "Why did you not rest enough?", options: ["Too Much Work", "Guilt of Resting", "No Time", "Forgot to Take Breaks"] } },
  { id: 22, text: "How much did you enjoy your daily activities this week?", category: "Happiness", followUp: { question: "What stopped you from enjoying activities?", options: ["Boredom", "Stress", "No Free Time", "Feeling Empty"] } },
  { id: 23, text: "How well did you handle pressure this week?", category: "Stress", followUp: { question: "What type of pressure was hardest?", options: ["Academic Pressure", "Family Expectations", "Peer Pressure", "Self-Imposed Pressure"] } },
  { id: 24, text: "How safe and comfortable do you feel in your college?", category: "Social", followUp: { question: "What makes you feel uncomfortable?", options: ["Bullying / Teasing", "Unfair Treatment", "Loneliness", "Toxic Environment"] } },
  { id: 25, text: "How clear are you about your goals this week?", category: "Motivation", followUp: { question: "What is making your goals unclear?", options: ["Too Many Options", "No Guidance", "Changed Interests", "Fear of Failure"] } },
  { id: 26, text: "How much did you worry about your future this week?", category: "Anxiety", followUp: { question: "What specifically worried you?", options: ["Getting a Job", "Financial Independence", "Meeting Family Expectations", "Skill Gap"] } },
  { id: 27, text: "How kind were you to yourself this week?", category: "Emotional", followUp: { question: "What made it hard to be kind to yourself?", options: ["Self Criticism", "Comparing with Others", "Past Mistakes", "Feeling Not Good Enough"] } },
  { id: 28, text: "How well did you eat and take care of your body?", category: "Health", followUp: { question: "What affected your self care?", options: ["No Time", "No Appetite", "Skipping Meals Due to Stress", "Financial Constraints"] } },
  { id: 29, text: "How much did social media affect your mood this week?", category: "Emotional", followUp: { question: "How did social media negatively affect you?", options: ["Self Criticism", "Comparison with Others", "Negative News", "Too Much Screen Time"] } },
  { id: 30, text: "How proud are you of yourself this week?", category: "Confidence", followUp: { question: "What made it hard to feel proud?", options: ["Did Not Meet My Own Expectations", "Others Did Better", "Made Mistakes", "Felt Unproductive"] } },
];

function getWeeklyQuestions() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  const startIndex = ((weekNumber - 1) * 10) % questionBank.length;
  const selected = [];
  for (let i = 0; i < 10; i++) {
    selected.push(questionBank[(startIndex + i) % questionBank.length]);
  }
  return selected;
}

function getScoreColor(score) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

const QuizSection = ({ onQuizComplete }) => {
  const [questions] = useState(getWeeklyQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkQuiz = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/quiz/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.submitted) {
          setAlreadySubmitted(true);
          setResult({ moodScore: res.data.moodScore, moodLabel: res.data.moodLabel });
        }
      } catch (error) {
        console.error("Error checking quiz", error);
      }
      setChecking(false);
    };
    checkQuiz();
  }, []);

  const handleSelect = (score, followUpAnswer = null) => {
    setSelectedScore(score);
    if (followUpAnswer) setSelectedFollowUp(followUpAnswer);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const answerEntry = {
      questionText: currentQuestion.text,
      score: selectedScore,
      followUpQuestion: selectedScore <= 2 && currentQuestion.followUp ? currentQuestion.followUp.question : null,
      followUpAnswer: selectedScore <= 2 ? selectedFollowUp : null,
    };
    const newAnswers = [...answers, answerEntry];
    setAnswers(newAnswers);
    setSelectedScore(null);
    setSelectedFollowUp(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.post("/quiz/submit", { answers: finalAnswers }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult({ moodScore: res.data.moodScore, moodLabel: res.data.moodLabel });
      setSubmitted(true);
      if (onQuizComplete) onQuizComplete();
    } catch (error) {
      console.error("Submit error", error);
    }
    setLoading(false);
  };

  if (checking || loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">{checking ? "Loading quiz..." : "Submitting your quiz..."}</p>
      </div>
    );
  }

  if (alreadySubmitted && !submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">You already completed this week's quiz.</p>
          <p className="text-xs text-gray-400">Come back next week for a new one.</p>
        </div>
        {result && (
          <div className={`text-center rounded-2xl px-8 py-4 ${getScoreColor(result.moodScore).replace("text-", "bg-").replace("600","50").replace("500","50")}`}>
            <p className={`text-4xl font-black ${getScoreColor(result.moodScore)}`}>{result.moodScore}%</p>
            <p className="text-sm text-gray-500 mt-1">{result.moodLabel}</p>
          </div>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Quiz completed! Your response has been recorded.</p>
          <p className="text-xs text-gray-400">See you next week.</p>
        </div>
        {result && (
          <div className={`text-center rounded-2xl px-8 py-4 ${getScoreColor(result.moodScore).replace("text-", "bg-").replace("600","50").replace("500","50")}`}>
            <p className={`text-4xl font-black ${getScoreColor(result.moodScore)}`}>{result.moodScore}%</p>
            <p className="text-sm text-gray-500 mt-1">{result.moodLabel}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-black/10">
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      <QuestionCard
        question={questions[currentIndex]}
        selected={selectedScore}
        onSelect={handleSelect}
      />
      <button
        onClick={handleNext}
        disabled={selectedScore === null}
        className="mt-6 w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {currentIndex + 1 === questions.length ? "Submit Quiz" : "Next Question →"}
      </button>
    </div>
  );
};

export default QuizSection;