const Rating = require("../models/Rating");
const Appointment = require("../models/Appointment");
const { createNotification } = require("./notificationController");

// It allows a student to submit a rating for a completed session with a counselor
exports.submitRating = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      appointmentId,
      professionalism,
      clarity,
      empathy,
      helpfulness,
      overallSatisfaction,
    } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      studentId,
      status: "Completed",
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Session not found or not completed yet.",
      });
    }

    const existingRating = await Rating.findOne({ appointmentId });
    if (existingRating) {
      return res.status(400).json({
        message: "You have already rated this session.",
      });
    }

    const scores = [
      professionalism,
      clarity,
      empathy,
      helpfulness,
      overallSatisfaction,
    ];

    let allValid = true;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] < 1 || scores[i] > 5) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      return res.status(400).json({
        message: "All questions must be rated between 1 and 5.",
      });
    }

    const rating = await Rating.create({
      appointmentId,
      studentId,
      counselorId: appointment.counselorId,
      professionalism,
      clarity,
      empathy,
      helpfulness,
      overallSatisfaction,
    });

    await createNotification(
      appointment.counselorId,
      "You received a new rating",
      "A student has submitted a rating for your session on " +
        appointment.date,
      "general",
      "/counselor-ratings",
    );

    res.status(201).json({
      message: "Thank you! Your rating has been recorded.",
      rating,
    });
  } catch (error) {
    console.error("Submit Rating Error:", error);
    res.status(500).json({ message: "Error submitting rating." });
  }
};

// It checks if a student has already submitted a rating for a session
exports.checkRating = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const studentId = req.user.id;

    const existing = await Rating.findOne({ appointmentId, studentId });
    let hasRated = false;
    if (existing) {
      hasRated = true;
    }

    res.status(200).json({
      hasRated: hasRated,
      rating: existing || null,
    });
  } catch (error) {
    console.error("Check Rating Error:", error);
    res.status(500).json({ message: "Error checking rating." });
  }
};

//  It allows a counselor to get a detailed breakdown of all their ratings and averages across the 5 questions.
exports.getCounselorRatings = async (req, res) => {
  try {
    const counselorId = req.user.id;

    const ratings = await Rating.find({ counselorId });

    if (ratings.length === 0) {
      return res.status(200).json({
        totalRatings: 0,
        averages: {
          professionalism: 0,
          clarity: 0,
          empathy: 0,
          helpfulness: 0,
          overallSatisfaction: 0,
          overall: 0,
        },
        ratings: [],
      });
    }

    const sum = {
      professionalism: 0,
      clarity: 0,
      empathy: 0,
      helpfulness: 0,
      overallSatisfaction: 0,
    };

    ratings.forEach((r) => {
      sum.professionalism += r.professionalism;
      sum.clarity += r.clarity;
      sum.empathy += r.empathy;
      sum.helpfulness += r.helpfulness;
      sum.overallSatisfaction += r.overallSatisfaction;
    });

    const count = ratings.length;
    const averages = {
      professionalism: +(sum.professionalism / count).toFixed(2),
      clarity: +(sum.clarity / count).toFixed(2),
      empathy: +(sum.empathy / count).toFixed(2),
      helpfulness: +(sum.helpfulness / count).toFixed(2),
      overallSatisfaction: +(sum.overallSatisfaction / count).toFixed(2),
    };

    const overall = +(
      (averages.professionalism +
        averages.clarity +
        averages.empathy +
        averages.helpfulness +
        averages.overallSatisfaction) /
      5
    ).toFixed(2);
    averages.overall = overall;

    res.status(200).json({
      totalRatings: count,
      averages: averages,
      ratings,
    });
  } catch (error) {
    console.error("Get Counselor Ratings Error:", error);
    res.status(500).json({ message: "Error fetching ratings." });
  }
};

//  It allows the students to see the counselor overall rating
exports.getPublicCounselorRating = async (req, res) => {
  try {
    const { counselorId } = req.params;

    const ratings = await Rating.find({ counselorId });

    if (ratings.length === 0) {
      return res.status(200).json({
        totalRatings: 0,
        overall: 0,
      });
    }

    const count = ratings.length;
    let totalOverall = 0;
    for (let i = 0; i < ratings.length; i++) {
      const r = ratings[i];
      const avg =
        (r.professionalism +
          r.clarity +
          r.empathy +
          r.helpfulness +
          r.overallSatisfaction) /
        5;
      totalOverall = totalOverall + avg;
    }

    const overall = +(totalOverall / count).toFixed(2);

    res.status(200).json({
      totalRatings: count,
      overall,
    });
  } catch (error) {
    console.error("Get Public Rating Error:", error);
    res.status(500).json({ message: "Error fetching public rating." });
  }
};
