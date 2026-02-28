const Appointment = require("../models/Appointment");
const { createZoomMeeting } = require("../utils/zoomService");
const { createNotification } = require("./notificationController");
const { awardPoints } = require("./gamificationController");

// It approves a session request and creates a Zoom meeting
exports.approveAndCreateZoom = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const counselorId = req.user.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      counselorId: counselorId,
    })
      .populate("studentId", "name")
      .populate("counselorId", "name");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const zoomData = await createZoomMeeting(
      appointment.date,
      appointment.timeSlot,
      appointment.studentId.name,
      appointment.counselorId.name,
    );

    appointment.status = "Approved";
    appointment.zoomLink = zoomData.joinLink;
    appointment.zoomMeetingId = zoomData.meetingId;
    appointment.startLink = zoomData.startLink;
    await appointment.save();

    await createNotification(
      appointment.studentId._id,
      "Session Confirmed — Zoom Link Ready!",
      "Your session on " +
        appointment.date +
        " at " +
        appointment.timeSlot +
        " is confirmed. Your Zoom link is ready.",
      "booking_approved",
      "/my-sessions",
    );

    res.status(200).json({
      message: `Request Approved! The Session is on ${appointment.date}!`,
      appointment,
    });
  } catch (error) {
    console.error("Approve Error:", error);
    res.status(500).json({ message: "Error approving session." });
  }
};

// It allows the counselor to start a session by providing the Zoom start link
exports.startSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const counselorId = req.user.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      counselorId: counselorId,
      status: "Approved",
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({
      message: "Session Started!",
      startLink: appointment.startLink,
    });
  } catch (error) {
    console.error("Start Session Error:", error);
    res.status(500).json({ message: "Error starting session." });
  }
};

// It allows the counselor to end a session and prompts for summary
exports.endSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const counselorId = req.user.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      counselorId: counselorId,
      status: "Approved",
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.status = "Completed";
    await appointment.save();
    await awardPoints(appointment.studentId.toString(), "session");

    res.status(200).json({
      message: "Session Ended! Please write a summary for the student.",
      appointment,
    });
  } catch (error) {
    console.error("End Session Error:", error);
    res.status(500).json({ message: "Error ending session." });
  }
};

// It allows the student to join the Zoom meeting using the join link
exports.joinSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const studentId = req.user.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      studentId: studentId,
      status: "Approved",
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({
      message: "Joining Session!",
      joinLink: appointment.zoomLink,
    });
  } catch (error) {
    console.error("Join Session Error:", error);
    res.status(500).json({ message: "Error joining session." });
  }
};

// It allows the counselor to save a summary after the session is completed
exports.saveSummary = async (req, res) => {
  try {
    const { appointmentId, summary } = req.body;
    const counselorId = req.user.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      counselorId,
      status: "Completed",
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.summary = summary;
    await appointment.save();

    res.status(200).json({ message: "Summary saved.", summary });
  } catch (error) {
    console.error("Save Summary Error:", error);
    res.status(500).json({ message: "Error saving summary." });
  }
};

// It allows either the counselor or student to fetch the session summary
exports.getSummary = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    let appointment = await Appointment.findOne({
      _id: appointmentId,
      counselorId: userId,
    });
    if (!appointment) {
      appointment = await Appointment.findOne({
        _id: appointmentId,
        studentId: userId,
      });
    }

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    let summary = null;
    if (appointment.summary) {
      summary = appointment.summary;
    }

    res.status(200).json({ summary: summary });
  } catch (error) {
    console.error("Get Summary Error:", error);
    res.status(500).json({ message: "Error fetching summary." });
  }
};
