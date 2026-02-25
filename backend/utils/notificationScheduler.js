const Appointment = require("../models/Appointment");
const User = require("../models/User");
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
  let hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);
  const ampm = parts[1].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function getTodayDateString() {
  const nepalTime = getNepalTime();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = nepalTime.getUTCDate();
  const dayStr = day < 10 ? "0" + day : "" + day;
  const month = monthNames[nepalTime.getUTCMonth()];
  const year = nepalTime.getUTCFullYear();
  return dayStr + " " + month + " " + year;
}

async function checkUpcomingSessions() {
  try {
    const nepalTime = getNepalTime();
    const currentMinutes =
      nepalTime.getUTCHours() * 60 + nepalTime.getUTCMinutes();
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

      if (minutesUntilSession === 30) {
        await createNotification(
          session.studentId,
          "Session Starting in 30 Minutes!",
          "Your session is starting at " +
            session.timeSlot +
            ". Please be ready.",
          "session_reminder",
          "/my-sessions",
        );

        await createNotification(
          session.counselorId,
          "Session Starting in 30 Minutes!",
          "You have a session starting at " +
            session.timeSlot +
            ". Please be ready.",
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
    const dayOfWeek = nepalTime.getUTCDay();
    const hour = nepalTime.getUTCHours();
    const minute = nepalTime.getUTCMinutes();

    if (dayOfWeek !== 1) return;
    if (hour !== 8) return;
    if (minute !== 0) return;

    const students = await User.find({ role: "Student", status: "Approved" });

    for (let i = 0; i < students.length; i++) {
      await createNotification(
        students[i]._id,
        "Weekly Mood Quiz is Ready!",
        "Your weekly mood quiz is now available. Take a few minutes to check in with yourself.",
        "quiz_reminder",
        "/mood-quiz",
      );
    }

    console.log(
      "Weekly quiz reminders sent to " + students.length + " students",
    );
  } catch (error) {
    console.log("Weekly quiz reminder failed:", error.message);
  }
}

async function sendDailyCheckInReminder() {
  try {
    const nepalTime = getNepalTime();
    const hour = nepalTime.getUTCHours();
    const minute = nepalTime.getUTCMinutes();

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
