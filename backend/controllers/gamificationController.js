const Gamification = require("../models/Gamification");
const MoodQuiz = require("../models/MoodQuiz");

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800];
const LEVEL_TITLES = ["Seedling", "Climber", "Mindful", "Sherpa", "Summit"];
const ALL_BADGES = [
  { name: "First Step", description: "completed your first mood quiz" },
  {
    name: "Session Starter",
    description: "attended your first counseling session",
  },
  { name: "Voice", description: "made your first post in the community forum" },
  { name: "Helper", description: "helped someone in the community forum" },
  { name: "Consistent", description: "completed the quiz 3 weeks in a row" },
  { name: "Comeback", description: "returned to the app after being away" },
  { name: "Resource Explorer", description: "explored 5 different resources" },
  {
    name: "Community Pillar",
    description: "made 10 interactions in the community forum",
  },
  {
    name: "MindCare Champion",
    description: "completed all activity types in one month",
  },
  {
    name: "Resilient",
    description: "showed up and engaged even when your mood was declining",
  },
];

function getLevelFromPoints(points) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}

function hasBadge(badges, badgeName) {
  for (let i = 0; i < badges.length; i++) {
    if (badges[i].name === badgeName) {
      return true;
    }
  }
  return false;
}

function checkAndResetRestDays(gamification) {
  const now = new Date();
  const lastReset = new Date(gamification.lastRestDayReset);

  const sameMonth = now.getMonth() === lastReset.getMonth();
  const sameYear = now.getFullYear() === lastReset.getFullYear();

  if (!sameMonth || !sameYear) {
    gamification.restDaysUsed = 0;
    gamification.lastRestDayReset = now;
  }
}

function generateMilestoneLetter(badgeName, moodTrend) {
  const LETTER_TEMPLATES = {
    "First Step":
      "Dear Student, you just completed your very first mood quiz — and that matters more than you might think. Checking in with yourself is not always easy, but you did it anyway. This is the first seed planted in your MindCare garden. Keep showing up for yourself, one small step at a time.",

    "Session Starter":
      "Dear Student, you attended your first counseling session today, and that took real courage. Reaching out for support is one of the strongest things a person can do. Your garden grows when you take care of yourself like this. We hope the session was helpful — you deserve that support.",

    Voice:
      "Dear Student, you shared your thoughts in the community forum for the first time. Speaking up, even anonymously, is a brave and meaningful act. Someone out there may have read your words and felt less alone because of you. Your voice is a valuable part of this community.",

    Helper:
      "Dear Student, someone found your reply helpful and liked it — you genuinely helped another student today. In a space where everyone is going through something, your kindness made a real difference. A rare plant has bloomed in your garden because of this. Keep being that person for others.",

    Consistent:
      "Dear Student, you have completed the mood quiz three weeks in a row. Consistency is one of the hardest things to build, and you have done it. Your garden is growing steadily because you keep showing up for yourself. This kind of self-awareness is a powerful tool for your mental health.",

    Comeback:
      "Dear Student, welcome back. Life gets busy and overwhelming, and stepping away sometimes happens. What matters is that you came back, and that says something important about you. Your garden is still here, still growing, still waiting for you. We are glad you returned.",

    "Resource Explorer":
      "Dear Student, you have explored five different resources in the library — that is a sign of someone who is actively investing in their own wellbeing. Every article and video you engage with adds something to your journey. Your curiosity is one of your greatest strengths. Keep exploring.",

    "Community Pillar":
      "Dear Student, you have made ten interactions in the community forum. You have become a steady presence in this space — someone others can see and feel supported by. Communities like this only work because people like you show up. Thank you for being part of it.",

    "MindCare Champion":
      "Dear Student, this month you completed every type of activity MindCare offers — quizzes, sessions, forum, resources, and ratings. That is remarkable. Your garden is at its most vibrant right now because of everything you have done. You are living proof that small consistent actions create real change.",

    Resilient:
      "Dear Student, your mood has been difficult recently — and yet you still showed up. You still engaged, still checked in, still kept going. That is not a small thing. That is resilience in its truest form. Your garden has weathered the rain and is still standing. So are you.",
  };

  let letter = LETTER_TEMPLATES[badgeName];
  if (!letter) {
    letter =
      "Dear Student, congratulations on earning the " +
      badgeName +
      " badge! Every step you take in your wellness journey matters. Your MindCare garden is growing because of your effort. Keep going.";
  }

  if (moodTrend === "Declining") {
    letter =
      letter +
      " We know things feel hard right now — please be gentle with yourself this week.";
  } else if (moodTrend === "Improving") {
    letter =
      letter +
      " Your mood has been improving lately — that positive momentum is something to be proud of.";
  } else {
    letter =
      letter +
      " You are holding steady, and that consistency is worth celebrating.";
  }

  return letter;
}

async function getMoodTrend(studentId) {
  const recentQuizzes = await MoodQuiz.find({ student: studentId })
    .sort({ createdAt: -1 })
    .limit(2);

  if (recentQuizzes.length < 2) {
    return "Stable";
  }

  const latestScore = recentQuizzes[0].moodScore;
  const previousScore = recentQuizzes[1].moodScore;

  if (latestScore > previousScore) {
    return "Improving";
  } else if (latestScore < previousScore) {
    return "Declining";
  } else {
    return "Stable";
  }
}

const awardPoints = async (studentId, activityType) => {
  try {
    const POINT_VALUES = {
      quiz: 10,
      session: 30,
      post: 10,
      reply: 5,
      helped: 15,
      rating: 5,
      resource: 5,
    };

    let gamification = await Gamification.findOne({ studentId });
    if (!gamification) {
      gamification = new Gamification({ studentId });
    }

    checkAndResetRestDays(gamification);

    let pointsToAdd = POINT_VALUES[activityType];
    if (!pointsToAdd) {
      pointsToAdd = 5;
    }

    const moodTrend = await getMoodTrend(studentId);
    if (moodTrend === "Declining") {
      pointsToAdd = pointsToAdd * 2;
    }

    gamification.points = gamification.points + pointsToAdd;

    const newLevel = getLevelFromPoints(gamification.points);
    gamification.level = newLevel;

    const todayStr = new Date().toISOString().split("T")[0];
    if (gamification.lastActivityDate !== todayStr) {
      gamification.currentStreak = gamification.currentStreak + 1;
      gamification.lastActivityDate = todayStr;
    }

    await gamification.save();

    await checkAndAwardBadges(studentId, activityType, gamification);

    return { success: true, pointsAdded: pointsToAdd, moodTrend };
  } catch (error) {
    console.error("Award Points Error:", error.message);
    return { success: false };
  }
};

const checkAndAwardBadges = async (studentId, activityType, gamification) => {
  try {
    const newBadgesToAward = [];

    if (
      activityType === "quiz" &&
      !hasBadge(gamification.badges, "First Step")
    ) {
      const quizCount = await MoodQuiz.countDocuments({ student: studentId });
      if (quizCount >= 1) {
        newBadgesToAward.push("First Step");
      }
    }

    if (
      activityType === "session" &&
      !hasBadge(gamification.badges, "Session Starter")
    ) {
      newBadgesToAward.push("Session Starter");
    }

    if (activityType === "post" && !hasBadge(gamification.badges, "Voice")) {
      newBadgesToAward.push("Voice");
    }

    if (activityType === "helped" && !hasBadge(gamification.badges, "Helper")) {
      newBadgesToAward.push("Helper");
    }

    if (
      activityType === "resource_5" &&
      !hasBadge(gamification.badges, "Resource Explorer")
    ) {
      newBadgesToAward.push("Resource Explorer");
    }

    if (
      activityType === "quiz" &&
      !hasBadge(gamification.badges, "Consistent")
    ) {
      if (gamification.currentStreak >= 3) {
        newBadgesToAward.push("Consistent");
      }
    }

    const moodTrend = await getMoodTrend(studentId);
    if (
      moodTrend === "Declining" &&
      !hasBadge(gamification.badges, "Resilient")
    ) {
      newBadgesToAward.push("Resilient");
    }

    if (
      gamification.currentStreak === 1 &&
      !hasBadge(gamification.badges, "Comeback")
    ) {
      if (gamification.points > 20) {
        newBadgesToAward.push("Comeback");
      }
    }

    for (let i = 0; i < newBadgesToAward.length; i++) {
      const badgeName = newBadgesToAward[i];

      gamification.badges.push({ name: badgeName, earnedAt: new Date() });

      let badgeDescription = "engaged with MindCare";
      for (let j = 0; j < ALL_BADGES.length; j++) {
        if (ALL_BADGES[j].name === badgeName) {
          badgeDescription = ALL_BADGES[j].description;
          break;
        }
      }

      const letterText = generateMilestoneLetter(badgeName, moodTrend);

      gamification.milestoneLetters.push({
        badgeName,
        letterText,
        createdAt: new Date(),
      });
    }

    await gamification.save();
    return newBadgesToAward;
  } catch (error) {
    console.error("Badge Check Error:", error.message);
    return [];
  }
};

const getGamificationData = async (req, res) => {
  try {
    const studentId = req.user.id;

    let gamification = await Gamification.findOne({ studentId });

    if (!gamification) {
      return res.status(200).json({
        points: 0,
        level: 1,
        levelTitle: LEVEL_TITLES[0],
        badges: [],
        milestoneLetters: [],
        restDaysUsed: 0,
        restDaysRemaining: 2,
        currentStreak: 0,
        nextLevelPoints: LEVEL_THRESHOLDS[1],
        moodTrend: "Stable",
      });
    }

    checkAndResetRestDays(gamification);
    await gamification.save();

    let nextLevelPoints = null;
    if (gamification.level < 5) {
      nextLevelPoints = LEVEL_THRESHOLDS[gamification.level];
    }

    const moodTrend = await getMoodTrend(studentId);

    res.status(200).json({
      points: gamification.points,
      level: gamification.level,
      levelTitle: LEVEL_TITLES[gamification.level - 1],
      badges: gamification.badges,
      milestoneLetters: gamification.milestoneLetters,
      restDaysUsed: gamification.restDaysUsed,
      restDaysRemaining: 2 - gamification.restDaysUsed,
      currentStreak: gamification.currentStreak,
      nextLevelPoints,
      moodTrend,
    });
  } catch (error) {
    console.error("Get Gamification Error:", error.message);
    res.status(500).json({ message: "Error fetching gamification data." });
  }
};

const getLetters = async (req, res) => {
  try {
    const studentId = req.user.id;

    const gamification = await Gamification.findOne({ studentId });

    if (!gamification) {
      return res.status(200).json([]);
    }

    res.status(200).json(gamification.milestoneLetters);
  } catch (error) {
    console.error("Get Letters Error:", error.message);
    res.status(500).json({ message: "Error fetching letters." });
  }
};

const useRestDay = async (req, res) => {
  try {
    const studentId = req.user.id;

    let gamification = await Gamification.findOne({ studentId });

    if (!gamification) {
      return res.status(404).json({ message: "Gamification data not found." });
    }
    checkAndResetRestDays(gamification);

    if (gamification.restDaysUsed >= 2) {
      return res.status(400).json({
        message: "You have used all your rest days for this month.",
        restDaysRemaining: 0,
      });
    }

    gamification.restDaysUsed = gamification.restDaysUsed + 1;
    await gamification.save();

    const remaining = 2 - gamification.restDaysUsed;

    res.status(200).json({
      message: "Rest day used. Your streak is safe. It is okay to rest.",
      restDaysRemaining: remaining,
    });
  } catch (error) {
    console.error("Use Rest Day Error:", error.message);
    res.status(500).json({ message: "Error using rest day." });
  }
};

module.exports = {
  getGamificationData,
  getLetters,
  useRestDay,
  awardPoints,
  checkAndAwardBadges,
};
