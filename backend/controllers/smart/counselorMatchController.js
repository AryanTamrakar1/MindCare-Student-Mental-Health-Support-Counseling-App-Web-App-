const User = require("../../models/User");
const MoodQuiz = require("../../models/MoodQuiz");

function calculateMatchScore(counselor, weakestCategory) {
  let score = 0;

  const specialization = counselor.specialization || "";

  if (weakestCategory) {
    const lowerSpec = specialization.toLowerCase();
    const lowerCategory = weakestCategory.toLowerCase();

    if (lowerSpec.includes(lowerCategory)) {
      score = score + 10;
    }
  }

  return score;
}

function buildCategoryScores(quizzes) {
  const categoryScores = {};

  for (let i = 0; i < quizzes.length; i++) {
    const quiz = quizzes[i];
    for (let j = 0; j < quiz.answers.length; j++) {
      const answer = quiz.answers[j];
      const category = answer.category || "General";

      if (categoryScores[category] === undefined) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(answer.score);
    }
  }

  const categoryAverages = {};
  const categoryNames = Object.keys(categoryScores);

  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const scores = categoryScores[name];
    let total = 0;
    for (let j = 0; j < scores.length; j++) {
      total = total + scores[j];
    }
    categoryAverages[name] = Math.round((total / scores.length) * 10) / 10;
  }

  return categoryAverages;
}

function findWeakestCategory(categoryAverages) {
  const names = Object.keys(categoryAverages);
  if (names.length === 0) return null;

  let weakest = names[0];
  for (let i = 1; i < names.length; i++) {
    if (categoryAverages[names[i]] < categoryAverages[weakest]) {
      weakest = names[i];
    }
  }

  return weakest;
}

const getSmartCounselorSuggestions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const quizzes = await MoodQuiz.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(4);

    let weakestCategory = null;
    let isCrisis = false;

    if (quizzes.length > 0) {
      const categoryAverages = buildCategoryScores(quizzes);
      weakestCategory = findWeakestCategory(categoryAverages);

      const latestScore = quizzes[0].moodScore;
      if (latestScore < 40) {
        isCrisis = true;
      }
    }

    const counselors = await User.find({
      role: "Counselor",
      status: "Approved",
    }).select("name specialization bio profTitle verificationPhoto");

    const scored = [];

    for (let i = 0; i < counselors.length; i++) {
      const counselor = counselors[i];
      const matchScore = calculateMatchScore(counselor, weakestCategory);
      scored.push({ counselor, matchScore });
    }

    scored.sort((a, b) => b.matchScore - a.matchScore);

    const top3 = [];
    for (let i = 0; i < Math.min(3, scored.length); i++) {
      let matchReason = "Available and highly rated";
      if (weakestCategory) {
        matchReason = "Matches your " + weakestCategory + " concern";
      }

      top3.push({
        _id: scored[i].counselor._id,
        name: scored[i].counselor.name,
        specialization: scored[i].counselor.specialization,
        profTitle: scored[i].counselor.profTitle,
        bio: scored[i].counselor.bio,
        verificationPhoto: scored[i].counselor.verificationPhoto,
        matchScore: scored[i].matchScore,
        matchReason,
      });
    }

    return res.json({
      suggestions: top3,
      weakestCategory,
      isCrisis,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSmartCounselorSuggestions };
