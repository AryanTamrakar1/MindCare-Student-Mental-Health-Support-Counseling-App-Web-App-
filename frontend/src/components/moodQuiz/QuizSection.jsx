import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import API from "../../api/axios";

function getScoreColor(score) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBg(score) {
  if (score >= 80) return "bg-green-50";
  if (score >= 60) return "bg-blue-50";
  if (score >= 40) return "bg-yellow-50";
  return "bg-red-50";
}

const QuizSection = ({ onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
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
    const checkAndLoad = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const checkRes = await API.get("/quiz/check", {
          headers: { Authorization: "Bearer " + token },
        });

        if (checkRes.data.submitted) {
          setAlreadySubmitted(true);
          setResult({
            moodScore: checkRes.data.moodScore,
            moodLabel: checkRes.data.moodLabel,
          });
          setChecking(false);
          return;
        }

        const quizRes = await API.get("/smart/smart-quiz", {
          headers: { Authorization: "Bearer " + token },
        });

        setQuestions(quizRes.data.questions);
      } catch (error) {
        console.error("Error loading quiz", error);
      }
      setChecking(false);
    };

    checkAndLoad();
  }, []);

  function handleSelect(score, followUpAnswer) {
    setSelectedScore(score);
    if (followUpAnswer) {
      setSelectedFollowUp(followUpAnswer);
    }
  }

  function handleNext() {
    const currentQuestion = questions[currentIndex];

    let followUpQuestion = null;
    let followUpAnswer = null;

    if (selectedScore <= 2 && currentQuestion.followUp) {
      followUpQuestion = currentQuestion.followUp.question;
    }
    if (selectedScore <= 2) {
      followUpAnswer = selectedFollowUp;
    }

    const answerEntry = {
      questionText: currentQuestion.text,
      category: currentQuestion.category,
      score: selectedScore,
      followUpQuestion: followUpQuestion,
      followUpAnswer: followUpAnswer,
    };

    const newAnswers = [];
    for (let i = 0; i < answers.length; i++) {
      newAnswers.push(answers[i]);
    }
    newAnswers.push(answerEntry);

    setAnswers(newAnswers);
    setSelectedScore(null);
    setSelectedFollowUp(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  }

  async function handleSubmit(finalAnswers) {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.post(
        "/quiz/submit",
        { answers: finalAnswers },
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      setResult({
        moodScore: res.data.moodScore,
        moodLabel: res.data.moodLabel,
      });
      setSubmitted(true);
      if (onQuizComplete) {
        onQuizComplete();
      }
    } catch (error) {
      console.error("Submit error", error);
    }
    setLoading(false);
  }

  if (checking || loading) {
    let loadingText = "Submitting your quiz...";
    if (checking) {
      loadingText = "Loading your quiz...";
    }
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">{loadingText}</p>
      </div>
    );
  }

  if (alreadySubmitted && !submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">
            You already completed this week's quiz.
          </p>
          <p className="text-xs text-gray-400">
            Come back next week for a new one.
          </p>
        </div>
        {result && (
          <div className={"text-center rounded-2xl px-8 py-4 " + getScoreBg(result.moodScore)}>
            <p className={"text-4xl font-black " + getScoreColor(result.moodScore)}>
              {result.moodScore}%
            </p>
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
          <p className="text-sm text-gray-600 mb-1">
            Quiz completed! Your response has been recorded.
          </p>
          <p className="text-xs text-gray-400">See you next week.</p>
        </div>
        {result && (
          <div className={"text-center rounded-2xl px-8 py-4 " + getScoreBg(result.moodScore)}>
            <p className={"text-4xl font-black " + getScoreColor(result.moodScore)}>
              {result.moodScore}%
            </p>
            <p className="text-sm text-gray-500 mt-1">{result.moodLabel}</p>
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/10 text-center">
        <p className="text-sm text-gray-400">Could not load quiz questions.</p>
      </div>
    );
  }

  let buttonText = "Next Question";
  if (currentIndex + 1 === questions.length) {
    buttonText = "Submit Quiz";
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
        {buttonText}
      </button>
    </div>
  );
};

export default QuizSection;