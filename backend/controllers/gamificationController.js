const Gamification = require("../models/Gamification");
const MoodQuiz = require("../models/MoodQuiz");
const { createNotification } = require("./notificationController");

const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];
const LEVEL_TITLES = ["Trying", "Healing", "Blooming", "Thriving", "Mindful"];

const ALL_BADGES = [
  { name: "First Step", description: "completed your first mood quiz" },
  {
    name: "Session Starter",
    description: "attended your first counseling session",
  },
  {
    name: "First Voice",
    description: "made your first post in the community forum",
  },
  { name: "The Helper", description: "helped someone in the community forum" },
  {
    name: "The Consistent One",
    description: "completed the quiz 3 weeks in a row",
  },
  { name: "The Comeback", description: "returned to the app after being away" },
  {
    name: "The Resource Explorer",
    description: "explored 5 different resources",
  },
  {
    name: "The Community Pillar",
    description: "made 10 interactions in the community forum",
  },
  {
    name: "The MindCare Champion",
    description: "completed all activity types in one month",
  },
  {
    name: "The Resilient One",
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

function checkAndResetMonthlyActivities(gamification) {
  const now = new Date();
  const lastReset = gamification.lastMonthlyActivityReset
    ? new Date(gamification.lastMonthlyActivityReset)
    : null;

  if (
    !lastReset ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    gamification.monthlyActivities = {
      quiz: false,
      session: false,
      post: false,
      resource: false,
      rating: false,
    };
    gamification.lastMonthlyActivityReset = now;
  }
}

function generateMilestoneLetter(badgeName, moodTrend) {
  const LETTER_TEMPLATES = {
    "First Step":
      "Dear Student, you just completed your very first mood quiz — and that matters more than you might think. Checking in with yourself is not always easy, but you did it anyway. Keep showing up for yourself, one small step at a time.",
    "Session Starter":
      "Dear Student, you attended your first counseling session today, and that took real courage. Reaching out for support is one of the strongest things a person can do. We hope the session was helpful — you deserve that support.",
    "First Voice":
      "Dear Student, you shared your thoughts in the community forum for the first time. Speaking up, even anonymously, is a brave and meaningful act. Someone out there may have read your words and felt less alone because of you.",
    "The Helper":
      "Dear Student, someone found your reply helpful and liked it — you genuinely helped another student today. In a space where everyone is going through something, your kindness made a real difference. Keep being that person for others.",
    "The Consistent One":
      "Dear Student, you have completed the mood quiz three weeks in a row. Consistency is one of the hardest things to build, and you have done it. This kind of self-awareness is a powerful tool for your mental health.",
    "The Comeback":
      "Dear Student, welcome back. Life gets busy and overwhelming, and stepping away sometimes happens. What matters is that you came back, and that says something important about you. We are glad you returned.",
    "The Resource Explorer":
      "Dear Student, you have explored five different resources in the library — that is a sign of someone who is actively investing in their own wellbeing. Your curiosity is one of your greatest strengths. Keep exploring.",
    "The Community Pillar":
      "Dear Student, you have made ten interactions in the community forum. You have become a steady presence in this space — someone others can see and feel supported by. Thank you for being part of it.",
    "The MindCare Champion":
      "Dear Student, this month you completed every type of activity MindCare offers — quizzes, sessions, forum, resources, and ratings. That is remarkable. You are living proof that small consistent actions create real change.",
    "The Resilient One":
      "Dear Student, your mood has been difficult recently — and yet you still showed up. You still engaged, still checked in, still kept going. That is not a small thing. That is resilience in its truest form.",
  };

  let letter = LETTER_TEMPLATES[badgeName];
  if (!letter) {
    letter =
      "Dear Student, congratulations on earning the " +
      badgeName +
      " badge! Every step you take in your wellness journey matters. Keep going.";
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
      like: 10,
    };

    let gamification = await Gamification.findOne({ studentId });

    if (!gamification) {
      gamification = new Gamification({ studentId });
    }

    checkAndResetRestDays(gamification);
    checkAndResetMonthlyActivities(gamification);

    let pointsToAdd = POINT_VALUES[activityType];
    if (!pointsToAdd) {
      pointsToAdd = 5;
    }

    const moodTrend = await getMoodTrend(studentId);
    if (moodTrend === "Declining") {
      pointsToAdd = pointsToAdd * 2;
    }

    const previousLevel = gamification.level;

    gamification.points = gamification.points + pointsToAdd;

    const newLevel = getLevelFromPoints(gamification.points);
    gamification.level = newLevel;

    const todayStr = new Date().toISOString().split("T")[0];
    if (gamification.lastActivityDate !== todayStr) {
      gamification.currentStreak = gamification.currentStreak + 1;
      gamification.lastActivityDate = todayStr;
    }

    if (!gamification.monthlyActivities) {
      gamification.monthlyActivities = {
        quiz: false,
        session: false,
        post: false,
        resource: false,
        rating: false,
      };
    }
    if (activityType === "quiz") gamification.monthlyActivities.quiz = true;
    if (activityType === "session") gamification.monthlyActivities.session = true;
    if (activityType === "post") gamification.monthlyActivities.post = true;
    if (activityType === "resource") gamification.monthlyActivities.resource = true;
    if (activityType === "rating") gamification.monthlyActivities.rating = true;
    gamification.markModified("monthlyActivities");

    if (activityType === "post" || activityType === "reply") {
      gamification.forumInteractions = (gamification.forumInteractions || 0) + 1;
    }

    await gamification.save();

    if (newLevel > previousLevel) {
      await createNotification(
        studentId,
        "You leveled up!",
        "Congratulations! You reached Level " +
          newLevel +
          " — " +
          LEVEL_TITLES[newLevel - 1] +
          ". Keep going!",
        "general",
        "/student/gamification",
      );
    }

    await checkAndAwardBadges(studentId, activityType, gamification);

    return { success: true, pointsAdded: pointsToAdd, moodTrend };
  } catch (error) {
    console.error("Award Points Error FULL:", error);
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

    if (
      activityType === "post" &&
      !hasBadge(gamification.badges, "First Voice")
    ) {
      newBadgesToAward.push("First Voice");
    }

    if (
      activityType === "helped" &&
      !hasBadge(gamification.badges, "The Helper")
    ) {
      newBadgesToAward.push("The Helper");
    }

    if (
      activityType === "resource_5" &&
      !hasBadge(gamification.badges, "The Resource Explorer")
    ) {
      newBadgesToAward.push("The Resource Explorer");
    }

    if (
      activityType === "quiz" &&
      !hasBadge(gamification.badges, "The Consistent One")
    ) {
      if (gamification.currentStreak >= 3) {
        newBadgesToAward.push("The Consistent One");
      }
    }

    const moodTrend = await getMoodTrend(studentId);
    if (
      moodTrend === "Declining" &&
      !hasBadge(gamification.badges, "The Resilient One")
    ) {
      newBadgesToAward.push("The Resilient One");
    }

    if (
      gamification.currentStreak === 1 &&
      !hasBadge(gamification.badges, "The Comeback")
    ) {
      if (gamification.points > 20) {
        newBadgesToAward.push("The Comeback");
      }
    }

    if (
      (activityType === "post" || activityType === "reply") &&
      !hasBadge(gamification.badges, "The Community Pillar")
    ) {
      if ((gamification.forumInteractions || 0) >= 10) {
        newBadgesToAward.push("The Community Pillar");
      }
    }

    if (!hasBadge(gamification.badges, "The MindCare Champion")) {
      const ma = gamification.monthlyActivities || {};
      if (ma.quiz && ma.session && ma.post && ma.resource && ma.rating) {
        newBadgesToAward.push("The MindCare Champion");
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

      await createNotification(
        studentId,
        "You earned a new badge!",
        "You just earned the " +
          badgeName +
          " badge. Check your Letters to Myself for a personal message.",
        "general",
        "/student/gamification",
      );
    }

    await gamification.save();
    return newBadgesToAward;
  } catch (error) {
    console.error("Badge Check Error FULL:", error);
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
        usedRestDayToday: false,
      });
    }

    checkAndResetRestDays(gamification);
    checkAndResetMonthlyActivities(gamification);
    await gamification.save();

    let safeLevel = gamification.level;
    if (!safeLevel || safeLevel < 1) safeLevel = 1;
    if (safeLevel > 5) safeLevel = 5;

    const recalculatedLevel = getLevelFromPoints(gamification.points || 0);
    safeLevel = recalculatedLevel;

    let nextLevelPoints = null;
    if (safeLevel < 5) {
      nextLevelPoints = LEVEL_THRESHOLDS[safeLevel];
    }

    const moodTrend = await getMoodTrend(studentId);

    const todayDate = new Date().toISOString().split("T")[0];
    const usedRestDayToday = gamification.lastRestDayDate === todayDate;

    res.status(200).json({
      points: gamification.points || 0,
      level: safeLevel,
      levelTitle: LEVEL_TITLES[safeLevel - 1],
      badges: gamification.badges || [],
      milestoneLetters: gamification.milestoneLetters || [],
      restDaysUsed: gamification.restDaysUsed || 0,
      restDaysRemaining: 2 - (gamification.restDaysUsed || 0),
      currentStreak: gamification.currentStreak || 0,
      nextLevelPoints,
      moodTrend,
      usedRestDayToday,
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
      gamification = new Gamification({ studentId });
      await gamification.save();
    }

    checkAndResetRestDays(gamification);

    if (gamification.restDaysUsed >= 2) {
      return res.status(400).json({
        message: "You have used all your rest days for this month.",
        restDaysRemaining: 0,
      });
    }

    const todayDate = new Date().toISOString().split("T")[0];
    if (gamification.lastRestDayDate === todayDate) {
      return res.status(400).json({
        message: "You have already used a rest day today.",
        restDaysRemaining: 2 - gamification.restDaysUsed,
      });
    }

    gamification.lastRestDayDate = todayDate;
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