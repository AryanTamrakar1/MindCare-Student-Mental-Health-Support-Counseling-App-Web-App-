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

  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

function calculateRateOfChange(scores) {
  if (scores.length < 2) return 0;

  let totalChange = 0;
  for (let i = 1; i < scores.length; i++) {
    totalChange = totalChange + (scores[i] - scores[i - 1]);
  }

  return Math.round((totalChange / (scores.length - 1)) * 10) / 10;
}

function calculateConsistency(scores) {
  if (scores.length < 2) return "Low";

  let total = 0;
  for (let i = 0; i < scores.length; i++) {
    total = total + scores[i];
  }
  const avg = total / scores.length;

  let totalDeviation = 0;
  for (let i = 0; i < scores.length; i++) {
    totalDeviation = totalDeviation + Math.abs(scores[i] - avg);
  }

  const avgDeviation = totalDeviation / scores.length;

  if (avgDeviation <= 5) return "High";
  if (avgDeviation <= 15) return "Medium";
  return "Low";
}

function getActionMessage(predictedScore, trend) {
  if (predictedScore < 40) {
    return "Your mood is predicted to drop significantly. Please book a counselor session urgently.";
  }
  if (trend === "Declining") {
    return "Your mood is predicted to decline next week. Consider booking a session with a counselor.";
  }
  if (trend === "Stable") {
    return "Your mood is predicted to remain stable. Keep up your current routine.";
  }
  return "Great progress! Your mood is predicted to improve next week. Keep going.";
}

function predictCategoryAtRisk(quizzes) {
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

  let highestRiskCategory = null;
  let highestRiskRate = 0;
  const categoryNames = Object.keys(categoryScores);

  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const scores = categoryScores[name];

    if (scores.length < 2) continue;

    const rate = calculateRateOfChange(scores);
    if (rate < highestRiskRate) {
      highestRiskRate = rate;
      highestRiskCategory = name;
    }
  }

  return highestRiskCategory;
}

async function getDailyMoodAverage(studentId) {
  const recentCheckIns = await DailyCheckIn.find({ student: studentId })
    .sort({ date: -1 })
    .limit(7);

  if (recentCheckIns.length === 0) return null;

  let total = 0;
  for (let i = 0; i < recentCheckIns.length; i++) {
    total = total + recentCheckIns[i].mood;
  }

  const avg = total / recentCheckIns.length;
  return Math.round((avg / 5) * 100 * 10) / 10;
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

const getMoodPrediction = async (req, res) => {
  try {
    const studentId = req.user.id;

    const quizzes = await MoodQuiz.find({ student: studentId })
      .sort({ createdAt: 1 })
      .limit(4);

    const dailyMoodAverage = await getDailyMoodAverage(studentId);
    const dailyCrisis = await checkDailyCheckInCrisis(studentId);

    if (quizzes.length < 1) {
      let message = "Complete your first weekly quiz to see your mood prediction.";
      if (dailyCrisis) {
        message = "Your daily check-ins show you have been feeling very low for 3 days in a row. Please consider talking to a counselor.";
      }
      return res.json({
        hasEnoughData: false,
        isCrisisRisk: dailyCrisis,
        message,
      });
    }

    const overallScores = [];
    for (let i = 0; i < quizzes.length; i++) {
      overallScores.push(quizzes[i].moodScore);
    }

    const weightedAverage = calculateWeightedAverage(overallScores);
    const rateOfChange = calculateRateOfChange(overallScores);

    let adjustedBase = weightedAverage;
    if (dailyMoodAverage !== null) {
      adjustedBase = Math.round(((weightedAverage * 0.7) + (dailyMoodAverage * 0.3)) * 10) / 10;
    }

    let predictedScore = adjustedBase + rateOfChange * 0.5;
    predictedScore = Math.round(predictedScore * 10) / 10;

    if (predictedScore > 100) predictedScore = 100;
    if (predictedScore < 0) predictedScore = 0;

    let predictedTrend = "Stable";
    if (rateOfChange > 0.3) predictedTrend = "Improving";
    if (rateOfChange < -0.3) predictedTrend = "Declining";

    const confidence = calculateConsistency(overallScores);
    const categoryAtRisk = predictCategoryAtRisk(quizzes);
    const actionMessage = getActionMessage(predictedScore, predictedTrend);

    let isCrisisRisk = false;
    if (predictedScore < 40) isCrisisRisk = true;
    if (dailyCrisis) isCrisisRisk = true;

    return res.json({
      hasEnoughData: true,
      predictedScore,
      predictedTrend,
      confidence,
      categoryAtRisk,
      actionMessage,
      isCrisisRisk,
      dailyCrisis,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMoodPrediction };