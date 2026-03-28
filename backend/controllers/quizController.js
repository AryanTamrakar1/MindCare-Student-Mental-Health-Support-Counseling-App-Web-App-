const MoodQuiz = require("../models/MoodQuiz");
const DailyCheckIn = require("../models/DailyCheckIn");
const { awardPoints } = require("./gamificationController");

function getWeekLabel(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(d.setDate(diff));
  
  const year = monday.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const msPerWeek = 604800000;
  const weekNumber = Math.ceil(((monday - new Date(jan4.getFullYear(), 0, 4)) / msPerWeek) + 1);
  
  return year + "-W" + String(weekNumber).padStart(2, "0");
}


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

const submitQuiz = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { answers } = req.body;

    const weekLabel = getWeekLabel(new Date());

    const existing = await MoodQuiz.findOne({ student: studentId, weekLabel });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted this week's quiz." });
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

    res
      .status(201)
      .json({ message: "Quiz submitted successfully!", moodScore, moodLabel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

const getMoodHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const history = await MoodQuiz.find({ student: studentId }).sort({
      createdAt: 1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const submitCheckIn = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mood } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const existing = await DailyCheckIn.findOne({
      student: studentId,
      date: today,
    });
    if (existing) {
      return res.status(400).json({ message: "You already checked in today." });
    }

    const emojiMap = { 1: "😔", 2: "😟", 3: "😐", 4: "🙂", 5: "😊" };

    const checkIn = new DailyCheckIn({
      student: studentId,
      date: today,
      mood,
      moodEmoji: emojiMap[mood],
    });

    await checkIn.save();

    res
      .status(201)
      .json({ message: "Check-in saved!", moodEmoji: emojiMap[mood] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCheckInHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const history = await DailyCheckIn.find({ student: studentId })
      .sort({ date: -1 })
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
  getCheckInHistory,
};