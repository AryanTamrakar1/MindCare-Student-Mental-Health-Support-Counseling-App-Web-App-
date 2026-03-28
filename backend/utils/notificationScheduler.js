const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const MoodQuiz = require("../models/MoodQuiz");
const { createNotification } = require("../controllers/notificationController");

function getNepalTime() {
  const nowUTC = new Date();
  const nepalOffsetMs = (5 * 60 + 45) * 60000;
  return new Date(nowUTC.getTime() + nepalOffsetMs);
}

function parseTimeSlotStart(timeSlot) {
  if (!timeSlot) return null;
  const startStr = timeSlot.split(" - ")[0].trim();
  const parts = startStr.split(" ");
  if (parts.length < 2) return null;
  const timeParts = parts[0].split(":");
  let hour = parseInt(timeParts[0], 10);
  const minute = parseInt(timeParts[1], 10);
  const ampm = parts[1].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function getTodayDateString() {
  const nepalTime = getNepalTime();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = nepalTime.getDate();
  const dayStr = day < 10 ? "0" + day : "" + day;
  const month = monthNames[nepalTime.getMonth()];
  const year = nepalTime.getFullYear();
  return dayStr + " " + month + " " + year;
}

function getWeekLabel(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const year = monday.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const msPerWeek = 604800000;
  const weekNumber = Math.ceil(
    (monday - new Date(jan4.getFullYear(), 0, 4)) / msPerWeek + 1,
  );
  return year + "-W" + String(weekNumber).padStart(2, "0");
}

async function checkUpcomingSessions() {
  try {
    const nepalTime = getNepalTime();
    const currentMinutes = nepalTime.getHours() * 60 + nepalTime.getMinutes();
    const todayStr = getTodayDateString();

    const todaySessions = await Appointment.find({
      date: todayStr,
      status: "Approved",
    });

    for (let i = 0; i < todaySessions.length; i++) {
      const session = todaySessions[i];
      const sessionStartMinutes = parseTimeSlotStart(session.timeSlot);
      if (sessionStartMinutes === null) continue;

      const minutesUntilSession = sessionStartMinutes - currentMinutes;

      if (minutesUntilSession >= 29 && minutesUntilSession <= 31) {
        await createNotification(
          session.studentId,
          "Session Starting in 30 Minutes!",
          "Your session is starting at " + session.timeSlot + ". Please be ready.",
          "session_reminder",
          "/my-sessions",
        );

        await createNotification(
          session.counselorId,
          "Session Starting in 30 Minutes!",
          "You have a session starting at " + session.timeSlot + ". Please be ready.",
          "session_reminder",
          "/counselor-sessions",
        );
      }
    }
  } catch (error) {
    console.log("Session reminder check failed:", error.message);
  }
}

async function sendWeeklyQuizReminder() {
  try {
    const nepalTime = getNepalTime();
    const dayOfWeek = nepalTime.getDay();
    const hour = nepalTime.getHours();
    const minute = nepalTime.getMinutes();

    if (dayOfWeek !== 1) return;
    if (hour !== 8) return;
    if (minute !== 0) return;

    const students = await User.find({ role: "Student", status: "Approved" });

    // get start of this week (Monday at midnight)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const weekLabel = getWeekLabel(new Date());

    let sentCount = 0;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      // It skips if already submitted quiz this week
      const alreadySubmitted = await MoodQuiz.findOne({
        student: student._id,
        weekLabel,
      });
      if (alreadySubmitted) continue;

      // It skips if already notified this week
      const alreadyNotified = await Notification.findOne({
        userId: student._id,
        type: "quiz_reminder",
        createdAt: { $gte: monday },
      });
      if (alreadyNotified) continue;

      await createNotification(
        student._id,
        "Weekly Mood Quiz is Ready!",
        "Your weekly mood quiz is now available. Take a few minutes to check in with yourself.",
        "quiz_reminder",
        "/mood-quiz",
      );

      sentCount++;
    }

    console.log("Weekly quiz reminders sent to " + sentCount + " students");
  } catch (error) {
    console.log("Weekly quiz reminder failed:", error.message);
  }
}

async function sendDailyCheckInReminder() {
  try {
    const nepalTime = getNepalTime();
    const hour = nepalTime.getHours();
    const minute = nepalTime.getMinutes();

    if (hour !== 9) return;
    if (minute !== 0) return;

    const students = await User.find({ role: "Student", status: "Approved" });

    for (let i = 0; i < students.length; i++) {
      await createNotification(
        students[i]._id,
        "Daily Check-In Available!",
        "How are you feeling today? Take a moment to do your daily check-in.",
        "quiz_reminder",
        "/mood-quiz",
      );
    }

    console.log(
      "Daily check-in reminders sent to " + students.length + " students",
    );
  } catch (error) {
    console.log("Daily check-in reminder failed:", error.message);
  }
}

function startNotificationScheduler() {
  setInterval(async function () {
    await checkUpcomingSessions();
    await sendWeeklyQuizReminder();
    await sendDailyCheckInReminder();
  }, 60000);

  console.log("Notification scheduler started!");
}

module.exports = { startNotificationScheduler };