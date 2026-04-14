const MoodQuiz = require("../../models/MoodQuiz");

const questionBank = [
  { id: 1, text: "How stressed are you this week?", category: "Stress" },
  {
    id: 2,
    text: "How motivated do you feel this week?",
    category: "Motivation",
  },
  { id: 3, text: "How is your sleep quality this week?", category: "Sleep" },
  { id: 4, text: "How anxious do you feel this week?", category: "Anxiety" },
  {
    id: 5,
    text: "How confident are you feeling this week?",
    category: "Confidence",
  },
  {
    id: 6,
    text: "How happy do you feel overall this week?",
    category: "Happiness",
  },
  {
    id: 7,
    text: "How productive were you this week?",
    category: "Productivity",
  },
  {
    id: 8,
    text: "How frustrated did you feel this week?",
    category: "Emotional",
  },
  {
    id: 9,
    text: "How well did you manage your emotions this week?",
    category: "Emotional",
  },
  {
    id: 10,
    text: "How connected did you feel with your peers this week?",
    category: "Social",
  },
  {
    id: 11,
    text: "How balanced did your life feel this week?",
    category: "Wellbeing",
  },
  {
    id: 12,
    text: "How hopeful are you about your future this week?",
    category: "Motivation",
  },
  {
    id: 13,
    text: "How physically healthy did you feel this week?",
    category: "Health",
  },
  {
    id: 14,
    text: "How focused were you during your studies this week?",
    category: "Productivity",
  },
  {
    id: 15,
    text: "How supported did you feel by your family this week?",
    category: "Social",
  },
  {
    id: 16,
    text: "How calm did you feel throughout this week?",
    category: "Anxiety",
  },
  {
    id: 17,
    text: "How satisfied are you with your academic progress this week?",
    category: "Stress",
  },
  { id: 18, text: "How energetic did you feel this week?", category: "Health" },
  {
    id: 19,
    text: "How comfortable are you talking about your problems?",
    category: "Social",
  },
  {
    id: 20,
    text: "How prepared do you feel for your career this week?",
    category: "Skill Gap",
  },
  {
    id: 21,
    text: "How often did you take breaks and rest this week?",
    category: "Wellbeing",
  },
  {
    id: 22,
    text: "How much did you enjoy your daily activities this week?",
    category: "Happiness",
  },
  {
    id: 23,
    text: "How well did you handle pressure this week?",
    category: "Stress",
  },
  {
    id: 24,
    text: "How safe and comfortable do you feel in your college?",
    category: "Social",
  },
  {
    id: 25,
    text: "How clear are you about your goals this week?",
    category: "Motivation",
  },
  {
    id: 26,
    text: "How much did you worry about your future this week?",
    category: "Anxiety",
  },
  {
    id: 27,
    text: "How kind were you to yourself this week?",
    category: "Emotional",
  },
  {
    id: 28,
    text: "How well did you eat and take care of your body?",
    category: "Health",
  },
  {
    id: 29,
    text: "How much did social media affect your mood this week?",
    category: "Emotional",
  },
  {
    id: 30,
    text: "How proud are you of yourself this week?",
    category: "Confidence",
  },
];

// It selects 10 questions from the question bank based on the week number
function getDefaultQuestions(weekNumber) {
  const startIndex = ((weekNumber - 1) * 10) % questionBank.length;
  const selected = [];
  for (let i = 0; i < 10; i++) {
    selected.push(questionBank[(startIndex + i) % questionBank.length]);
  }
  return selected;
}

// It returns the current week number of the year
function getWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7,
  );
}

// It calculates the average score per category from a list of quizzes
function buildCategoryAverages(quizzes) {
  const categoryData = {};

  for (let i = 0; i < quizzes.length; i++) {
    const quiz = quizzes[i];
    for (let j = 0; j < quiz.answers.length; j++) {
      const answer = quiz.answers[j];
      const category = answer.category || "General";

      if (categoryData[category] === undefined) {
        categoryData[category] = { total: 0, count: 0 };
      }
      categoryData[category].total =
        categoryData[category].total + answer.score;
      categoryData[category].count = categoryData[category].count + 1;
    }
  }

  const averages = {};
  const names = Object.keys(categoryData);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    averages[name] = categoryData[name].total / categoryData[name].count;
  }

  return averages;
}

// It finds the two weakest categories based on average scores
function findTwoWeakestCategories(categoryAverages) {
  const names = Object.keys(categoryAverages);

  if (names.length === 0) return [];

  let first = names[0];
  for (let i = 1; i < names.length; i++) {
    if (categoryAverages[names[i]] < categoryAverages[first]) {
      first = names[i];
    }
  }

  let second = null;
  for (let i = 0; i < names.length; i++) {
    if (names[i] === first) continue;
    if (second === null) {
      second = names[i];
      continue;
    }
    if (categoryAverages[names[i]] < categoryAverages[second]) {
      second = names[i];
    }
  }

  const result = [];
  result.push(first);
  if (second !== null) result.push(second);
  return result;
}

// It gets a set number of questions from a specific category
function getQuestionsByCategory(category, count) {
  const pool = [];
  for (let i = 0; i < questionBank.length; i++) {
    if (questionBank[i].category === category) {
      pool.push(questionBank[i]);
    }
  }

  const selected = [];
  for (let i = 0; i < count; i++) {
    if (i < pool.length) {
      selected.push(pool[i]);
    }
  }
  return selected;
}

// It builds a set of 10 smart questions prioritizing the weakest categories
function buildSmartQuestions(weakCategories, weekNumber) {
  const usedIds = {};
  const result = [];

  if (weakCategories.length >= 1) {
    const firstWeakQuestions = getQuestionsByCategory(weakCategories[0], 4);
    for (let i = 0; i < firstWeakQuestions.length; i++) {
      result.push(firstWeakQuestions[i]);
      usedIds[firstWeakQuestions[i].id] = true;
    }
  }

  if (weakCategories.length >= 2) {
    const secondWeakQuestions = getQuestionsByCategory(weakCategories[1], 3);
    for (let i = 0; i < secondWeakQuestions.length; i++) {
      result.push(secondWeakQuestions[i]);
      usedIds[secondWeakQuestions[i].id] = true;
    }
  }

  const defaultQuestions = getDefaultQuestions(weekNumber);
  for (let i = 0; i < defaultQuestions.length; i++) {
    if (result.length >= 10) break;
    if (usedIds[defaultQuestions[i].id]) continue;
    result.push(defaultQuestions[i]);
    usedIds[defaultQuestions[i].id] = true;
  }

  if (result.length < 10) {
    for (let i = 0; i < questionBank.length; i++) {
      if (result.length >= 10) break;
      if (usedIds[questionBank[i].id]) continue;
      result.push(questionBank[i]);
      usedIds[questionBank[i].id] = true;
    }
  }

  return result;
}

// It returns personalized quiz questions based on the student's past quiz results
const getSmartQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const weekNumber = getWeekNumber();

    const quizzes = await MoodQuiz.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(4);

    if (quizzes.length === 0) {
      const defaultQuestions = getDefaultQuestions(weekNumber);
      return res.json({
        questions: defaultQuestions,
        weakCategories: [],
      });
    }

    const categoryAverages = buildCategoryAverages(quizzes);
    const weakCategories = findTwoWeakestCategories(categoryAverages);
    const questions = buildSmartQuestions(weakCategories, weekNumber);

    return res.json({
      questions,
      weakCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSmartQuestions };
