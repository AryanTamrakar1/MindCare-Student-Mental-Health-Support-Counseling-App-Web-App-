import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const QuizSectionContext = createContext(null);

export const QuizSectionProvider = ({ children, onQuizComplete }) => {
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
    if (followUpAnswer) setSelectedFollowUp(followUpAnswer);
  }

  function handleNext() {
    const currentQuestion = questions[currentIndex];
    let followUpQuestion = null;
    let followUpAnswer = null;
    if (selectedScore <= 2 && currentQuestion.followUp)
      followUpQuestion = currentQuestion.followUp.question;
    if (selectedScore <= 2) followUpAnswer = selectedFollowUp;

    const answerEntry = {
      questionText: currentQuestion.text,
      category: currentQuestion.category,
      score: selectedScore,
      followUpQuestion: followUpQuestion,
      followUpAnswer: followUpAnswer,
    };

    const newAnswers = [];
    for (let i = 0; i < answers.length; i++) newAnswers.push(answers[i]);
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
      if (onQuizComplete) onQuizComplete();
    } catch (error) {
      console.error("Submit error", error);
    }
    setLoading(false);
  }

  return (
    <QuizSectionContext.Provider
      value={{
        questions,
        currentIndex,
        answers,
        selectedScore,
        selectedFollowUp,
        alreadySubmitted,
        submitted,
        result,
        loading,
        checking,
        handleSelect,
        handleNext,
      }}
    >
      {children}
    </QuizSectionContext.Provider>
  );
};

export const useQuizSectionContext = () => {
  const ctx = useContext(QuizSectionContext);
  if (!ctx)
    throw new Error(
      "useQuizSectionContext must be used inside QuizSectionProvider"
    );
  return ctx;
};