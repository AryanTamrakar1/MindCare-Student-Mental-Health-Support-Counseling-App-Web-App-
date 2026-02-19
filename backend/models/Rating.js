const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    //-- Link to the Appointment --
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true, 
    },

    // -- Link to the Student --
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // -- Link to the Counselor --
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // -- Ratings --
    professionalism: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    clarity: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    empathy: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    overallSatisfaction: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Rating", ratingSchema);
