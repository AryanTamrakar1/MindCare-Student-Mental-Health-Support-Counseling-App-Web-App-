const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const MoodQuiz = require("../models/MoodQuiz");
const { createNotification } = require("../controllers/notificationController");
const {
  autoMarkMissedSessions,
} = require("../controllers/appointmentController");
const DailyCheckIn = require("../models/DailyCheckIn");

// It returns the current time in Nepal timezone
function getNepalTime() {
  const nowUTC = new Date();
  const nepalOffsetMs = (5 * 60 + 45) * 60000;
  return new Date(nowUTC.getTime() + nepalOffsetMs);
}

// It parses the start time of a time slot and returns it in total minutes
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

// It returns today's date as a formatted string in Nepal time
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

// It returns the week label for a given date
function getWeekLabel(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    monday.getDate() +
    " " +
    monthNames[monday.getMonth()] +
    " " +
    monday.getFullYear()
  );
}

// It checks for upcoming sessions and sends notifications to students and counselors 30 minutes before the session starts
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

      if (minutesUntilSession >= 29 && minutesUntilSession <= 31) {
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

// It sends weekly mood quiz reminders to students who haven't submitted yet
async function sendWeeklyQuizReminder() {
  try {
    const students = await User.find({ role: "Student", status: "Approved" });

    // get start of this week (Monday at midnight)
    const nepalNow = getNepalTime();
    const day2 = nepalNow.getUTCDay();
    const diff2 = nepalNow.getUTCDate() - day2 + (day2 === 0 ? -6 : 1);
    const monday = new Date(nepalNow);
    monday.setUTCDate(diff2);
    monday.setUTCHours(0, 0, 0, 0);

    const weekLabel = getWeekLabel(nepalNow);

    let sentCount = 0;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      // It skips if already submitted quiz this week
      const alreadySubmitted = await MoodQuiz.findOne({
        student: student._id,
        weekLabel,
      });
      if (alreadySubmitted) continue;

      // It skips if already notified in the last 24 hours
      const last24hrs = new Date(nepalNow.getTime() - 24 * 60 * 60 * 1000);
      const alreadyNotified = await Notification.findOne({
        userId: student._id,
        type: "quiz_reminder",
        createdAt: { $gte: last24hrs },
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

// It sends a daily check-in reminder to all students at 9am
async function sendDailyCheckInReminder() {
  try {
    const nepalTime = getNepalTime();
    const hour = nepalTime.getUTCHours();
    const minute = nepalTime.getUTCMinutes();

    if (hour !== 9) return;
    if (minute > 1) return;

    const todayStr = getTodayDateString();
    const students = await User.find({ role: "Student", status: "Approved" });

    let sentCount = 0;

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < students.length; i++) {
      const alreadyCheckedIn = await DailyCheckIn.findOne({
        student: students[i]._id,
        date: todayStr,
      });
      if (alreadyCheckedIn) continue;

      const alreadyNotified = await Notification.findOne({
        userId: students[i]._id,
        type: "checkin_reminder",
        createdAt: { $gte: todayStart },
      });
      if (alreadyNotified) continue;

      await createNotification(
        students[i]._id,
        "Daily Check-In Available!",
        "How are you feeling today? Take a moment to do your daily check-in.",
        "checkin_reminder",
        "/mood-quiz",
      );

      sentCount++;
    }

    console.log("Daily check-in reminders sent to " + sentCount + " students");
  } catch (error) {
    console.log("Daily check-in reminder failed:", error.message);
  }
}

// It starts the scheduler that runs every minute
function startNotificationScheduler() {
  setInterval(async function () {
    await checkUpcomingSessions();
    await sendWeeklyQuizReminder();
    await sendDailyCheckInReminder();
    await autoMarkMissedSessions();
  }, 60000);

  console.log("Notification scheduler started!");
}

module.exports = { startNotificationScheduler };
