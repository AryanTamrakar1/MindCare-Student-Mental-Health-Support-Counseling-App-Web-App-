const MoodQuiz = require("../../models/MoodQuiz");

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
  let totalChange = 0;

  for (let i = 1; i < scores.length; i++) {
    totalChange = totalChange + (scores[i] - scores[i - 1]);
  }

  return Math.round((totalChange / (scores.length - 1)) * 10) / 10;
}

function calculateConsistency(scores) {
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  let totalDeviation = 0;

  for (let i = 0; i < scores.length; i++) {
    totalDeviation = totalDeviation + Math.abs(scores[i] - avg);
  }

  const avgDeviation = totalDeviation / scores.length;

  if (avgDeviation <= 5) {
    return "High";
  }
  if (avgDeviation <= 15) {
    return "Medium";
  }
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

    if (scores.length < 2) {
      continue;
    }

    const rate = calculateRateOfChange(scores);

    if (rate < highestRiskRate) {
      highestRiskRate = rate;
      highestRiskCategory = name;
    }
  }

  return highestRiskCategory;
}

const getMoodPrediction = async (req, res) => {
  try {
    const studentId = req.user.id;

    const quizzes = await MoodQuiz.find({ student: studentId })
      .sort({ createdAt: 1 })
      .limit(4);

    if (quizzes.length < 2) {
      return res.json({
        hasEnoughData: false,
        message:
          "Complete at least 2 weekly quizzes to see your mood prediction.",
      });
    }

    const overallScores = [];
    for (let i = 0; i < quizzes.length; i++) {
      overallScores.push(quizzes[i].moodScore);
    }

    const weightedAverage = calculateWeightedAverage(overallScores);
    const rateOfChange = calculateRateOfChange(overallScores);

    let predictedScore = weightedAverage + rateOfChange * 0.5;
    predictedScore = Math.round(predictedScore * 10) / 10;

    if (predictedScore > 100) {
      predictedScore = 100;
    }
    if (predictedScore < 0) {
      predictedScore = 0;
    }

    let predictedTrend = "Stable";
    if (rateOfChange > 0.3) {
      predictedTrend = "Improving";
    }
    if (rateOfChange < -0.3) {
      predictedTrend = "Declining";
    }

    const confidence = calculateConsistency(overallScores);
    const categoryAtRisk = predictCategoryAtRisk(quizzes);
    const actionMessage = getActionMessage(predictedScore, predictedTrend);

    let isCrisisRisk = false;
    if (predictedScore < 40) {
      isCrisisRisk = true;
    }

    return res.json({
      hasEnoughData: true,
      predictedScore,
      predictedTrend,
      confidence,
      categoryAtRisk,
      actionMessage,
      isCrisisRisk,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMoodPrediction };
