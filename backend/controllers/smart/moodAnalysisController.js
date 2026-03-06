const MoodQuiz = require("../../models/MoodQuiz");
const DailyCheckIn = require("../../models/DailyCheckIn");

function calculateWeightedAverage(scores) {
  let weightedSum = 0;
  let totalWeight = 0;

  for (let i = 0; i < scores.length; i++) {
    const weight = i + 1;
    weightedSum = weightedSum + scores[i] * weight;
    totalWeight = totalWeight + weight;
  }

  const result = weightedSum / totalWeight;
  return Math.round(result * 10) / 10;
}

function calculateRateOfChange(scores) {
  if (scores.length < 2) return 0;

  let totalChange = 0;
  for (let i = 1; i < scores.length; i++) {
    totalChange = totalChange + (scores[i] - scores[i - 1]);
  }

  const rate = totalChange / (scores.length - 1);
  return Math.round(rate * 10) / 10;
}

function getTrendLabel(rate) {
  if (rate > 0.3) return "Improving";
  if (rate < -0.3) return "Declining";
  return "Stable";
}

function buildCategoryScores(allQuizzes) {
  const categoryData = {};

  for (let i = 0; i < allQuizzes.length; i++) {
    const quiz = allQuizzes[i];
    for (let j = 0; j < quiz.answers.length; j++) {
      const answer = quiz.answers[j];
      const category = answer.category || "General";

      if (categoryData[category] === undefined) {
        categoryData[category] = { total: 0, count: 0 };
      }
      categoryData[category].total = categoryData[category].total + answer.score;
      categoryData[category].count = categoryData[category].count + 1;
    }
  }

  const categoryAverages = {};
  const categoryNames = Object.keys(categoryData);

  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const avg = categoryData[name].total / categoryData[name].count;
    categoryAverages[name] = Math.round(avg * 10) / 10;
  }

  return categoryAverages;
}

function findWeakestCategory(categoryAverages) {
  const names = Object.keys(categoryAverages);
  if (names.length === 0) return null;

  let weakestName = names[0];
  let weakestScore = categoryAverages[names[0]];

  for (let i = 1; i < names.length; i++) {
    if (categoryAverages[names[i]] < weakestScore) {
      weakestScore = categoryAverages[names[i]];
      weakestName = names[i];
    }
  }

  return { category: weakestName, score: weakestScore };
}

async function checkDailyCheckInCrisis(studentId) {
  const recentCheckIns = await DailyCheckIn.find({ student: studentId })
    .sort({ date: -1 })
    .limit(3);

  if (recentCheckIns.length < 3) return false;

  let allLow = true;
  for (let i = 0; i < recentCheckIns.length; i++) {
    if (recentCheckIns[i].mood > 2) {
      allLow = false;
      break;
    }
  }

  return allLow;
}

const getMoodAnalysis = async (req, res) => {
  try {
    const studentId = req.user.id;

    const recentQuizzes = await MoodQuiz.find({ student: studentId })
      .sort({ createdAt: 1 })
      .limit(4);

    const allQuizzes = await MoodQuiz.find({ student: studentId })
      .sort({ createdAt: 1 });

    const dailyCrisis = await checkDailyCheckInCrisis(studentId);

    if (recentQuizzes.length < 1) {
      let message = "Complete your first weekly quiz to see your mood analysis.";
      if (dailyCrisis) {
        message = "Your daily check-ins show you have been feeling very low. Please consider talking to a counselor.";
      }
      return res.json({
        hasEnoughData: false,
        isCrisis: dailyCrisis,
        message,
      });
    }

    const overallScores = [];
    for (let i = 0; i < recentQuizzes.length; i++) {
      overallScores.push(recentQuizzes[i].moodScore);
    }

    const weightedAverage = calculateWeightedAverage(overallScores);
    const rateOfChange = calculateRateOfChange(overallScores);
    const trend = getTrendLabel(rateOfChange);

    const categoryAverages = buildCategoryScores(allQuizzes);
    const weakestCategory = findWeakestCategory(categoryAverages);

    let isCrisis = false;
    if (weightedAverage < 40) isCrisis = true;
    if (dailyCrisis) isCrisis = true;

    return res.json({
      hasEnoughData: true,
      weightedAverage,
      trend,
      rateOfChange,
      categoryAverages,
      weakestCategory,
      isCrisis,
      dailyCrisis,
      totalQuizzes: recentQuizzes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMoodAnalysis };