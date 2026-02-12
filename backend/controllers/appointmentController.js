const Appointment = require("../models/Appointment");
const User = require("../models/User");

// It allows a student to request a session with a counselor
exports.requestSession = async (req, res) => {
  try {
    const { counselorId, date, timeSlot, reason } = req.body;
    const studentId = req.user.id;

    if (!counselorId) {
      return res.status(400).json({ message: "Counselor ID is required." });
    }

    const counselor = await User.findById(counselorId);

    const dateObj = new Date(date);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "UTC",
    }).format(dateObj);

    const isAvailable = counselor.availability.some(
      (slot) => slot.day === dayName && slot.timeSlot === timeSlot,
    );

    if (!isAvailable) {
      return res.status(400).json({
        message:
          "Counselor is not available at this time. Please choose a different time.",
      });
    }

    const studentExistingAppointment = await Appointment.findOne({
      studentId,
      date,
      status: { $in: ["Pending", "Approved"] },
    });

    if (studentExistingAppointment) {
      return res.status(400).json({
        message:
          "You already have a session requested or booked for this day. You can only have one session per day.",
      });
    }

    const pendingCount = await Appointment.countDocuments({
      studentId,
      status: "Pending",
    });

    if (pendingCount >= 3) {
      return res.status(400).json({
        message:
          "You have too many pending requests (Limit is 3). Please wait for a counselor to respond before booking more.",
      });
    }

    const existingAppointment = await Appointment.findOne({
      counselorId,
      date,
      timeSlot,
      status: { $in: ["Pending", "Approved"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "This slot is already requested or booked for this specific date.",
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
    res
      .status(201)
      .json({ message: "Request Sent! Counselor will respond soon." });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// It checks the status of a counselor for a specific date
exports.checkAvailability = async (req, res) => {
  try {
    const { counselorId, date } = req.query;

    const bookedAppointments = await Appointment.find({
      counselorId,
      date,
      status: { $in: ["Pending", "Approved"] },
    }).select("timeSlot");
    const takenSlots = bookedAppointments.map((app) => app.timeSlot);

    res.status(200).json(takenSlots);
  } catch (error) {
    res.status(500).json({ message: "Error checking availability" });
  }
};

// It gets all sessions for a specific user
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

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
      return res
        .status(404)
        .json({ message: "Appointment not found or unauthorized." });
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
    const day = now.getDate().toString().padStart(2, "0");
    const month = now.toLocaleString("en-GB", { month: "short" });
    const year = now.getFullYear();
    const currentDate = `${day} ${month} ${year}`;

    const appointments = await Appointment.find({
      counselorId,
      date: currentDate,
      status: "Approved",
    });

    if (appointments.length === 0) {
      return res.status(200).json({ status: "Green", label: "Available" });
    } else {
      return res.status(200).json({ status: "Yellow", label: "Booked" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking live status" });
  }
};
