const MoodQuiz = require("../models/MoodQuiz");
const DailyCheckIn = require("../models/DailyCheckIn");
const { awardPoints } = require("./gamificationController");

// It converts a date into a week label string starting from Monday of that week
function getWeekLabel(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    monday.getDate() + " " + monthNames[monday.getMonth()] + " " + monday.getFullYear()
  );
}

// It calculates the mood score and label based on the student's quiz answers
function calculateMood(answers) {
  let total = 0;
  for (let i = 0; i < answers.length; i++) {
    total = total + answers[i].score;
  }
  const max = answers.length * 5;
  const percentage = Math.round((total / max) * 100);

  let label = "";
  if (percentage >= 80) {
    label = "Great";
  } else if (percentage >= 60) {
    label = "Okay";
  } else if (percentage >= 40) {
    label = "Low";
  } else {
    label = "Very Low";
  }

  return { moodScore: percentage, moodLabel: label };
}

// It allows a student to submit their weekly mood quiz and awards points on completion
const submitQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { answers } = req.body;

    const weekLabel = getWeekLabel(new Date());

    const existing = await MoodQuiz.findOne({ student: studentId, weekLabel });
    if (existing) {
      return res.status(400).json({ message: "You already submitted this week's quiz." });
    }

    const { moodScore, moodLabel } = calculateMood(answers);

    const quiz = new MoodQuiz({
      student: studentId,
      weekLabel,
      answers,
      moodScore,
      moodLabel,
    });

    await quiz.save();
    await awardPoints(studentId, "quiz");

    res.status(201).json({ message: "Quiz submitted successfully!", moodScore, moodLabel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// It checks if a student has already submitted their quiz for the current week
const checkQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const weekLabel = getWeekLabel(new Date());

    const existing = await MoodQuiz.findOne({ student: studentId, weekLabel });

    if (existing) {
      return res.json({
        submitted: true,
        moodScore: existing.moodScore,
        moodLabel: existing.moodLabel,
      });
    }

    res.json({ submitted: false });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// It returns all past mood quiz results for a student sorted by week
const getMoodHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const history = await MoodQuiz.find({ student: studentId }).sort({ weekLabel: 1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// It allows a student to submit a daily mood check-in with an emoji
const submitCheckIn = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mood, date } = req.body;

    const existing = await DailyCheckIn.findOne({ student: studentId, date });
    if (existing) {
      return res.status(400).json({ message: "You already checked in today." });
    }

    const emojiMap = { 1: "😔", 2: "😟", 3: "😐", 4: "🙂", 5: "😊" };

    const checkIn = new DailyCheckIn({
      student: studentId,
      date,
      mood,
      moodEmoji: emojiMap[mood],
    });

    await checkIn.save();

    res.status(201).json({ message: "Check-in saved!", moodEmoji: emojiMap[mood] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// It checks if a student has already checked in for a given date
const checkTodayCheckIn = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date } = req.query;

    const existing = await DailyCheckIn.findOne({ student: studentId, date });

    if (existing) {
      return res.json({ checkedIn: true, mood: existing.mood, moodEmoji: existing.moodEmoji });
    }

    res.json({ checkedIn: false });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// It returns the last 7 daily check-ins for a student
const getCheckInHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const history = await DailyCheckIn.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(7);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitQuiz,
  checkQuiz,
  getMoodHistory,
  submitCheckIn,
  checkTodayCheckIn,
  getCheckInHistory,
};