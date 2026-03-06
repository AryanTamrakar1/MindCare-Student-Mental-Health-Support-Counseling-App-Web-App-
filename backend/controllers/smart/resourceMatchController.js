const Resource = require("../../models/Resource");
const MoodQuiz = require("../../models/MoodQuiz");

function mapQuizCategoryToResourceCategory(quizCategory) {
  const map = {
    Stress: "Exam & Academic Pressure",
    Anxiety: "Exam & Academic Pressure",
    Motivation: "Low Motivation",
    Sleep: "Sleep & Energy",
    Energy: "Sleep & Energy",
    Confidence: "Skill Gap & Career Fear",
    Social: "Social Isolation",
    Emotional: "General Mental Health",
    General: "General Mental Health",
  };

  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i++) {
    if (quizCategory.toLowerCase().includes(keys[i].toLowerCase())) {
      return map[keys[i]];
    }
  }

  return "General Mental Health";
}

function buildCategoryScores(quizzes) {
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

  const categoryAverages = {};
  const names = Object.keys(categoryData);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    categoryAverages[name] =
      Math.round((categoryData[name].total / categoryData[name].count) * 10) /
      10;
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

function scoreResource(resource, targetCategory, collaborativeIds) {
  let score = 0;

  if (resource.category === targetCategory) {
    score = score + 10;
  }

  if (resource.isPriority) {
    score = score + 5;
  }

  for (let i = 0; i < collaborativeIds.length; i++) {
    if (resource._id.toString() === collaborativeIds[i].toString()) {
      score = score + 3;
      break;
    }
  }

  return score;
}

async function getCollaborativeResourceIds(studentId, latestScore) {
  const lowerBound = latestScore - 15;
  const upperBound = latestScore + 15;

  const similarQuizzes = await MoodQuiz.find({
    student: { $ne: studentId },
    moodScore: { $gte: lowerBound, $lte: upperBound },
  }).limit(20);

  const similarStudentIds = [];
  for (let i = 0; i < similarQuizzes.length; i++) {
    similarStudentIds.push(similarQuizzes[i].student);
  }

  if (similarStudentIds.length === 0) {
    return [];
  }

  const popularResources = await Resource.find({
    bookmarks: { $in: similarStudentIds },
  }).select("_id");

  const ids = [];
  for (let i = 0; i < popularResources.length; i++) {
    ids.push(popularResources[i]._id);
  }

  return ids;
}

const getSmartResourceSuggestions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const quizzes = await MoodQuiz.find({ student: studentId }).sort({
      createdAt: -1,
    });

    let targetCategory = "General Mental Health";
    let weakestQuizCategory = null;
    let latestScore = 50;

    if (quizzes.length > 0) {
      latestScore = quizzes[0].moodScore;
      const categoryAverages = buildCategoryScores(quizzes);
      weakestQuizCategory = findWeakestCategory(categoryAverages);

      if (weakestQuizCategory) {
        targetCategory = mapQuizCategoryToResourceCategory(weakestQuizCategory);
      }
    }

    const collaborativeIds = await getCollaborativeResourceIds(
      studentId,
      latestScore,
    );
    const allResources = await Resource.find();

    const scored = [];
    for (let i = 0; i < allResources.length; i++) {
      const resource = allResources[i];
      const matchScore = scoreResource(
        resource,
        targetCategory,
        collaborativeIds,
      );
      scored.push({ resource, matchScore });
    }

    scored.sort((a, b) => b.matchScore - a.matchScore);

    const top4 = [];
    for (let i = 0; i < Math.min(4, scored.length); i++) {
      top4.push({
        _id: scored[i].resource._id,
        title: scored[i].resource.title,
        link: scored[i].resource.link,
        type: scored[i].resource.type,
        category: scored[i].resource.category,
        estimatedTime: scored[i].resource.estimatedTime,
        description: scored[i].resource.description,
        isPriority: scored[i].resource.isPriority,
        matchScore: scored[i].matchScore,
      });
    }

    return res.json({
      suggestions: top4,
      targetCategory,
      weakestQuizCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSmartResourceSuggestions };
