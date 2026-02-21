const Appointment = require("../models/Appointment");
const User = require("../models/User");

// It handles all appointment-related operations, including requesting sessions, checking availability, and auto-marking missed sessions
function parseDateString(dateStr) {
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length < 3) return null;
  const day = parseInt(parts[0]);
  const month = monthMap[parts[1]];
  const year = parseInt(parts[2]);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(Date.UTC(year, month, day));
}

// It checks if a counselor is available for a given date and timeslot, and also ensures students don't double-book or exceed pending request limits. 
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

// It automatically marks sessions as "Missed" if the session time has passed without being marked as Completed.
async function autoMarkMissedSessions() {
  const nowUTC = new Date();
  const nepalOffsetMs = (5 * 60 + 45) * 60000;
  const nowNepal = new Date(nowUTC.getTime() + nepalOffsetMs);

  const todayMidnightNepal = new Date(Date.UTC(
    nowNepal.getUTCFullYear(),
    nowNepal.getUTCMonth(),
    nowNepal.getUTCDate(),
  ));

  const currentNepalMinutes = nowNepal.getUTCHours() * 60 + nowNepal.getUTCMinutes();
  const approvedSessions = await Appointment.find({ status: "Approved" });

  for (let i = 0; i < approvedSessions.length; i++) {
    const session = approvedSessions[i];
    const sessionDate = parseDateString(session.date);
    if (!sessionDate) continue;

    const sessionStartMinutes = parseTimeSlotStart(session.timeSlot);
    if (sessionStartMinutes === null) continue;
    const sessionEndWithGrace = sessionStartMinutes + 60 + 30;

    const isDateInPast = sessionDate < todayMidnightNepal;
    const isDateToday = sessionDate.getTime() === todayMidnightNepal.getTime();
    const isTodayAndEnded = isDateToday && currentNepalMinutes > sessionEndWithGrace;

    if (isDateInPast || isTodayAndEnded) {
      session.status = "Missed";
      await session.save();
    }
  }
}

// It allows a student to request a session with a counselor
exports.requestSession = async (req, res) => {
  try {
    const { counselorId, date, timeSlot, reason } = req.body;
    const studentId = req.user.id;

    if (!counselorId) {
      return res.status(400).json({ message: "Counselor ID is required." });
    }

    const counselor = await User.findById(counselorId);

    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = date.split(" ");
    const parsedDate = new Date(
      Date.UTC(parseInt(parts[2]), monthMap[parts[1]], parseInt(parts[0])),
    );

    const selectedDate = new Date(parsedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selectedDate < tomorrow) {
      return res.status(400).json({
        message: "Sessions must be booked at least 1 day in advance.",
      });
    }

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[parsedDate.getUTCDay()];

    let isAvailable = false;
    for (let i = 0; i < counselor.availability.length; i++) {
      if (
        counselor.availability[i].day === dayName &&
        counselor.availability[i].timeSlot === timeSlot
      ) {
        isAvailable = true;
        break;
      }
    }

    if (!isAvailable) {
      return res.status(400).json({
        message: "Counselor is not available at this time. Please choose a different time.",
      });
    }

    const studentAppointmentsOnDate = await Appointment.find({ studentId, date });
    let studentExistingAppointment = null;
    for (let i = 0; i < studentAppointmentsOnDate.length; i++) {
      if (
        studentAppointmentsOnDate[i].status === "Pending" ||
        studentAppointmentsOnDate[i].status === "Approved"
      ) {
        studentExistingAppointment = studentAppointmentsOnDate[i];
        break;
      }
    }

    if (studentExistingAppointment) {
      return res.status(400).json({
        message: "You already have a session requested or booked for this day. You can only have one session per day.",
      });
    }

    const pendingCount = await Appointment.countDocuments({
      studentId,
      status: "Pending",
    });

    if (pendingCount >= 3) {
      return res.status(400).json({
        message: "You have too many pending requests (Limit is 3). Please wait for a counselor to respond before booking more.",
      });
    }

    const counselorAppointmentsOnSlot = await Appointment.find({ counselorId, date, timeSlot });
    let existingAppointment = null;
    for (let i = 0; i < counselorAppointmentsOnSlot.length; i++) {
      if (
        counselorAppointmentsOnSlot[i].status === "Pending" ||
        counselorAppointmentsOnSlot[i].status === "Approved"
      ) {
        existingAppointment = counselorAppointmentsOnSlot[i];
        break;
      }
    }

    if (existingAppointment) {
      return res.status(400).json({
        message: "This slot is already requested or booked for this specific date.",
      });
    }

    const newAppointment = new Appointment({
      studentId,
      counselorId,
      date,
      timeSlot,
      reason,
      status: "Pending",
    });

    await newAppointment.save();
    res.status(201).json({ message: "Request Sent! Counselor will respond soon." });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// It checks if a counselor is available for a given date and timeslot, and also ensures students don't double-book or exceed pending request limits.
exports.checkAvailability = async (req, res) => {
  try {
    const { counselorId, date } = req.query;

    const allAppointments = await Appointment.find({ counselorId, date });

    const takenSlots = [];
    for (let i = 0; i < allAppointments.length; i++) {
      if (
        allAppointments[i].status === "Pending" ||
        allAppointments[i].status === "Approved" ||
        allAppointments[i].status === "Completed"
      ) {
        takenSlots.push(allAppointments[i].timeSlot);
      }
    }

    res.status(200).json(takenSlots);
  } catch (error) {
    res.status(500).json({ message: "Error checking availability" });
  }
};

// It gets all sessions for a specific user — also auto-marks missed sessions before returning
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    await autoMarkMissedSessions();

    let sessions;
    if (role === "Student") {
      sessions = await Appointment.find({ studentId: userId }).populate(
        "counselorId",
        "name email specialization",
      );
    } else if (role === "Counselor") {
      sessions = await Appointment.find({ counselorId: userId }).populate(
        "studentId",
        "name email",
      );
    } else {
      sessions = [];
    }

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
};

// It allows the counselor to Approve or Decline a session request
exports.updateStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const counselorId = req.user.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      counselorId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or unauthorized." });
    }

    appointment.status = status;
    await appointment.save();

    let message =
      status === "Approved"
        ? `Request Approved! The Session is on ${appointment.date}!`
        : `Your Request for this time was not accepted`;

    res.status(200).json({ message, appointment });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// It fetches all pending requests for a counselor
exports.getPendingRequests = async (req, res) => {
  try {
    const counselorId = req.user.id;

    const pending = await Appointment.find({
      counselorId: counselorId,
      status: "Pending",
    }).populate("studentId", "name email");

    res.status(200).json(pending);
  } catch (error) {
    console.error("Fetch Pending Error:", error);
    res.status(500).json({ message: "Error fetching pending requests" });
  }
};

// It checks if a counselor is available or booked for the current day
exports.getLiveStatus = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const now = new Date();

    const nepalOffset = 5 * 60 + 45;
    const nepalTime = new Date(now.getTime() + nepalOffset * 60000);

    const dayNum = nepalTime.getUTCDate();
    const day = dayNum < 10 ? "0" + dayNum : "" + dayNum;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[nepalTime.getUTCMonth()];

    const year = nepalTime.getUTCFullYear();
    const currentDate = `${day} ${month} ${year}`;

    const currentHour = nepalTime.getUTCHours();
    const currentMinutes = nepalTime.getUTCMinutes();

    const appointments = await Appointment.find({
      counselorId,
      date: currentDate,
      status: "Approved",
    });

    if (appointments.length === 0) {
      return res.status(200).json({ status: "Green", label: "Available" });
    }

    let hasUpcoming = false;

    for (let i = 0; i < appointments.length; i++) {
      const timeSlot = appointments[i].timeSlot;
      const startTime = timeSlot.split(" - ")[0];

      const timeParts = startTime.split(" ");
      const hourMin = timeParts[0].split(":");
      let hour = parseInt(hourMin[0]);
      const minutes = parseInt(hourMin[1]);
      const ampm = timeParts[1];

      if (ampm === "PM" && hour !== 12) hour = hour + 12;
      if (ampm === "AM" && hour === 12) hour = 0;

      const sessionStart = hour * 60 + minutes;
      const sessionEnd = sessionStart + 60;
      const currentTime = currentHour * 60 + currentMinutes;

      if (currentTime >= sessionStart && currentTime < sessionEnd) {
        return res.status(200).json({ status: "Red", label: "In Session" });
      }

      if (sessionStart > currentTime) {
        hasUpcoming = true;
      }
    }

    if (hasUpcoming) {
      return res.status(200).json({ status: "Yellow", label: "Booked" });
    }

    return res.status(200).json({ status: "Green", label: "Available" });
  } catch (error) {
    res.status(500).json({ message: "Error checking live status" });
  }
};

// It allows the counselor to start a session by providing the Zoom start link
exports.getCompletedCount = async (req, res) => {
  try {
    const { counselorId } = req.params;

    const count = await Appointment.countDocuments({
      counselorId: counselorId,
      status: "Completed",
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error counting completed appointments" });
  }
};