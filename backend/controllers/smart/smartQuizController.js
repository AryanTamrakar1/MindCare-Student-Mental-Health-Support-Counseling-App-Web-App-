const MoodQuiz = require("../../models/MoodQuiz");

const questionBank = [
  {
    id: 1,
    text: "How stressed are you this week?",
    category: "Stress",
    followUp: {
      question: "What is mainly causing your stress?",
      options: [
        "Exams / Assignments",
        "Family Pressure",
        "Financial Issues",
        "Skill Gap / Job Anxiety",
        "Relationships",
      ],
    },
  },
  {
    id: 2,
    text: "How motivated do you feel this week?",
    category: "Motivation",
    followUp: {
      question: "What is affecting your motivation?",
      options: [
        "Lack of Interest",
        "Too Much Workload",
        "Personal Problems",
        "Feeling Lost About Future",
      ],
    },
  },
  {
    id: 3,
    text: "How is your sleep quality this week?",
    category: "Sleep",
    followUp: {
      question: "What is disturbing your sleep?",
      options: [
        "Overthinking",
        "Late Night Study",
        "Anxiety",
        "Phone / Social Media",
      ],
    },
  },
  {
    id: 4,
    text: "How anxious do you feel this week?",
    category: "Anxiety",
    followUp: {
      question: "What is making you anxious?",
      options: [
        "Upcoming Exams",
        "Career Uncertainty",
        "Social Situations",
        "Family Expectations",
      ],
    },
  },
  {
    id: 5,
    text: "How confident are you feeling this week?",
    category: "Confidence",
    followUp: {
      question: "What is lowering your confidence?",
      options: [
        "Poor Academic Performance",
        "Skill Gap",
        "Comparison with Peers",
        "Negative Feedback",
      ],
    },
  },
  {
    id: 6,
    text: "How happy do you feel overall this week?",
    category: "Happiness",
    followUp: {
      question: "What is affecting your happiness?",
      options: [
        "Loneliness",
        "Academic Pressure",
        "Personal Loss",
        "Feeling Stuck",
      ],
    },
  },
  {
    id: 7,
    text: "How productive were you this week?",
    category: "Productivity",
    followUp: {
      question: "What stopped you from being productive?",
      options: [
        "Procrastination",
        "Distractions",
        "Low Energy",
        "Too Many Tasks",
      ],
    },
  },
  {
    id: 8,
    text: "How frustrated did you feel this week?",
    category: "Emotional",
    followUp: {
      question: "What frustrated you the most?",
      options: [
        "Studies",
        "People Around Me",
        "My Own Progress",
        "System / Institution",
      ],
    },
  },
  {
    id: 9,
    text: "How well did you manage your emotions this week?",
    category: "Emotional",
    followUp: {
      question: "What made it hard to manage emotions?",
      options: [
        "Too Much Pressure",
        "No One to Talk To",
        "Bad News",
        "Overwhelmed by Tasks",
      ],
    },
  },
  {
    id: 10,
    text: "How connected did you feel with your peers this week?",
    category: "Social",
    followUp: {
      question: "What affected your social connection?",
      options: [
        "Shyness",
        "Conflict with Friends",
        "Too Busy",
        "Feeling Different from Others",
      ],
    },
  },
  {
    id: 11,
    text: "How balanced did your life feel this week?",
    category: "Balance",
    followUp: {
      question: "What area felt most unbalanced?",
      options: [
        "Study vs Rest",
        "Social vs Personal Time",
        "Health vs Work",
        "Family vs College",
      ],
    },
  },
  {
    id: 12,
    text: "How hopeful are you about your future this week?",
    category: "Motivation",
    followUp: {
      question: "What is making you feel less hopeful?",
      options: [
        "Uncertain Career Path",
        "Skill Gap",
        "Financial Concerns",
        "Competitive Job Market",
      ],
    },
  },
  {
    id: 13,
    text: "How physically healthy did you feel this week?",
    category: "Health",
    followUp: {
      question: "What affected your physical health?",
      options: ["Poor Diet", "No Exercise", "Irregular Sleep", "Illness"],
    },
  },
  {
    id: 14,
    text: "How focused were you during your studies this week?",
    category: "Productivity",
    followUp: {
      question: "What broke your focus?",
      options: [
        "Phone / Social Media",
        "Noisy Environment",
        "Anxious Thoughts",
        "No Clear Goal",
      ],
    },
  },
  {
    id: 15,
    text: "How supported did you feel by your family this week?",
    category: "Social",
    followUp: {
      question: "What made you feel unsupported?",
      options: [
        "Pressure to Perform",
        "Lack of Communication",
        "Different Expectations",
        "Financial Stress at Home",
      ],
    },
  },
  {
    id: 16,
    text: "How calm did you feel throughout this week?",
    category: "Anxiety",
    followUp: {
      question: "What disturbed your calmness?",
      options: [
        "Deadlines",
        "Unexpected Problems",
        "Overthinking",
        "Conflicts",
      ],
    },
  },
  {
    id: 17,
    text: "How satisfied are you with your academic progress this week?",
    category: "Stress",
    followUp: {
      question: "What made you dissatisfied?",
      options: [
        "Poor Grades",
        "Not Understanding Concepts",
        "Falling Behind",
        "Comparison with Classmates",
      ],
    },
  },
  {
    id: 18,
    text: "How energetic did you feel this week?",
    category: "Health",
    followUp: {
      question: "What drained your energy?",
      options: [
        "Poor Sleep",
        "Skipping Meals",
        "Too Much Screen Time",
        "Emotional Stress",
      ],
    },
  },
  {
    id: 19,
    text: "How comfortable are you talking about your problems?",
    category: "Social",
    followUp: {
      question: "What stops you from opening up?",
      options: [
        "Fear of Judgment",
        "No Trusted Person",
        "Shame",
        "Don't Want to Burden Others",
      ],
    },
  },
  {
    id: 20,
    text: "How prepared do you feel for your career this week?",
    category: "Skill Gap",
    followUp: {
      question: "What makes you feel unprepared?",
      options: [
        "Lack of Skills",
        "No Work Experience",
        "Unclear Career Path",
        "Competition from Others",
      ],
    },
  },
  {
    id: 21,
    text: "How often did you take breaks and rest this week?",
    category: "Balance",
    followUp: {
      question: "Why did you not rest enough?",
      options: [
        "Too Much Work",
        "Guilt of Resting",
        "No Time",
        "Forgot to Take Breaks",
      ],
    },
  },
  {
    id: 22,
    text: "How much did you enjoy your daily activities this week?",
    category: "Happiness",
    followUp: {
      question: "What stopped you from enjoying activities?",
      options: ["Boredom", "Stress", "No Free Time", "Feeling Empty"],
    },
  },
  {
    id: 23,
    text: "How well did you handle pressure this week?",
    category: "Stress",
    followUp: {
      question: "What type of pressure was hardest?",
      options: [
        "Academic Pressure",
        "Family Expectations",
        "Peer Pressure",
        "Self-Imposed Pressure",
      ],
    },
  },
  {
    id: 24,
    text: "How safe and comfortable do you feel in your college?",
    category: "Social",
    followUp: {
      question: "What makes you feel uncomfortable?",
      options: [
        "Bullying / Teasing",
        "Unfair Treatment",
        "Loneliness",
        "Toxic Environment",
      ],
    },
  },
  {
    id: 25,
    text: "How clear are you about your goals this week?",
    category: "Motivation",
    followUp: {
      question: "What is making your goals unclear?",
      options: [
        "Too Many Options",
        "No Guidance",
        "Changed Interests",
        "Fear of Failure",
      ],
    },
  },
  {
    id: 26,
    text: "How much did you worry about your future this week?",
    category: "Anxiety",
    followUp: {
      question: "What specifically worried you?",
      options: [
        "Getting a Job",
        "Financial Independence",
        "Meeting Family Expectations",
        "Skill Gap",
      ],
    },
  },
  {
    id: 27,
    text: "How kind were you to yourself this week?",
    category: "Emotional",
    followUp: {
      question: "What made it hard to be kind to yourself?",
      options: [
        "Self Criticism",
        "Comparing with Others",
        "Past Mistakes",
        "Feeling Not Good Enough",
      ],
    },
  },
  {
    id: 28,
    text: "How well did you eat and take care of your body?",
    category: "Health",
    followUp: {
      question: "What affected your self care?",
      options: [
        "No Time",
        "No Appetite",
        "Skipping Meals Due to Stress",
        "Financial Constraints",
      ],
    },
  },
  {
    id: 29,
    text: "How much did social media affect your mood this week?",
    category: "Emotional",
    followUp: {
      question: "How did social media negatively affect you?",
      options: [
        "Self Criticism",
        "Comparison with Others",
        "Negative News",
        "Too Much Screen Time",
      ],
    },
  },
  {
    id: 30,
    text: "How proud are you of yourself this week?",
    category: "Confidence",
    followUp: {
      question: "What made it hard to feel proud?",
      options: [
        "Did Not Meet My Own Expectations",
        "Others Did Better",
        "Made Mistakes",
        "Felt Unproductive",
      ],
    },
  },
];

function getDefaultQuestions(weekNumber) {
  const startIndex = ((weekNumber - 1) * 10) % questionBank.length;
  const selected = [];
  for (let i = 0; i < 10; i++) {
    selected.push(questionBank[(startIndex + i) % questionBank.length]);
  }
  return selected;
}

function getWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7,
  );
}

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
        isAdaptive: false,
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
