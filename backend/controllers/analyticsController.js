const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Post = require("../models/Post");
const Rating = require("../models/Rating");
const MoodQuiz = require("../models/MoodQuiz");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

const getOverview = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "Student" });

    const totalCounselors = await User.countDocuments({
      role: "Counselor",
      status: "Approved",
    });

    const totalSessions = await Appointment.countDocuments({
      status: "Completed",
    });

    const totalPosts = await Post.countDocuments();

    let totalReplies = 0;
    const allPosts = await Post.find();
    for (let i = 0; i < allPosts.length; i++) {
      totalReplies = totalReplies + allPosts[i].replies.length;
    }

    const allRatings = await Rating.find();
    let ratingSum = 0;
    for (let i = 0; i < allRatings.length; i++) {
      const r = allRatings[i];
      const singleAvg =
        (r.professionalism +
          r.clarity +
          r.empathy +
          r.helpfulness +
          r.overallSatisfaction) /
        5;
      ratingSum = ratingSum + singleAvg;
    }

    let averageRating = 0;
    if (allRatings.length > 0) {
      averageRating = (ratingSum / allRatings.length).toFixed(1);
    }

    res.status(200).json({
      totalStudents,
      totalCounselors,
      totalSessions,
      totalPosts,
      totalReplies,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get overview", error });
  }
};

const getSessionAnalytics = async (req, res) => {
  try {
    const allAppointments = await Appointment.find();

    let completed = 0;
    let approved = 0;
    let declined = 0;
    let pending = 0;
    let missed = 0;

    for (let i = 0; i < allAppointments.length; i++) {
      const status = allAppointments[i].status;
      if (status === "Completed") {
        completed = completed + 1;
      } else if (status === "Approved") {
        approved = approved + 1;
      } else if (status === "Declined") {
        declined = declined + 1;
      } else if (status === "Pending") {
        pending = pending + 1;
      } else if (status === "Missed") {
        missed = missed + 1;
      }
    }

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
    const monthlyCounts = [];
    for (let m = 0; m < 12; m++) {
      monthlyCounts.push({ month: monthNames[m], sessions: 0 });
    }

    for (let i = 0; i < allAppointments.length; i++) {
      const date = new Date(allAppointments[i].createdAt);
      const monthIndex = date.getMonth();
      monthlyCounts[monthIndex].sessions =
        monthlyCounts[monthIndex].sessions + 1;
    }

    res.status(200).json({
      statusBreakdown: { completed, approved, declined, pending, missed },
      monthlyData: monthlyCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get session analytics", error });
  }
};

const getUserAnalytics = async (req, res) => {
  try {
    const allQuizzes = await MoodQuiz.find();

    let positive = 0;
    let neutral = 0;
    let negative = 0;

    const positiveLabels = ["Good"];
    const neutralLabels = ["Average"];
    const negativeLabels = ["Below Average", "Very Low"];

    for (let i = 0; i < allQuizzes.length; i++) {
      const label = allQuizzes[i].moodLabel;
      if (positiveLabels.includes(label)) {
        positive = positive + 1;
      } else if (neutralLabels.includes(label)) {
        neutral = neutral + 1;
      } else if (negativeLabels.includes(label)) {
        negative = negative + 1;
      }
    }

    const counselors = await User.find({
      role: "Counselor",
      status: "Approved",
    });
    const counselorStats = [];

    for (let i = 0; i < counselors.length; i++) {
      const counselorRatings = await Rating.find({
        counselorId: counselors[i]._id,
      });

      let sum = 0;
      for (let j = 0; j < counselorRatings.length; j++) {
        const r = counselorRatings[j];
        const singleAvg =
          (r.professionalism +
            r.clarity +
            r.empathy +
            r.helpfulness +
            r.overallSatisfaction) /
          5;
        sum = sum + singleAvg;
      }

      let avg = 0;
      if (counselorRatings.length > 0) {
        avg = (sum / counselorRatings.length).toFixed(1);
      }

      counselorStats.push({
        name: counselors[i].name,
        averageRating: avg,
        totalRatings: counselorRatings.length,
      });
    }

    res.status(200).json({
      moodBreakdown: { positive, neutral, negative },
      counselorStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user analytics", error });
  }
};

const getForumAnalytics = async (req, res) => {
  try {
    const allPosts = await Post.find();

    let totalReplies = 0;
    for (let i = 0; i < allPosts.length; i++) {
      totalReplies = totalReplies + allPosts[i].replies.length;
    }

    const topicCounts = {
      "Academic & Exam Pressure": 0,
      "Skill Gap & Job Anxiety": 0,
      "Family & Social Pressure": 0,
      "Emotional & Personal Issues": 0,
      "Sleep & Physical Wellbeing": 0,
      "General Mental Health": 0,
    };

    for (let i = 0; i < allPosts.length; i++) {
      const topic = allPosts[i].category;
      if (topic && topicCounts[topic] !== undefined) {
        topicCounts[topic] = topicCounts[topic] + 1;
      }
    }

    const topicData = [];
    const topicKeys = Object.keys(topicCounts);
    for (let i = 0; i < topicKeys.length; i++) {
      topicData.push({
        topic: topicKeys[i],
        count: topicCounts[topicKeys[i]],
      });
    }

    res.status(200).json({
      totalPosts: allPosts.length,
      totalReplies,
      topicData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get forum analytics", error });
  }
};

const downloadReport = async (req, res) => {
  try {
    const format = req.query.format;

    const totalStudents = await User.countDocuments({ role: "Student" });
    const totalCounselors = await User.countDocuments({
      role: "Counselor",
      status: "Approved",
    });
    const totalSessions = await Appointment.countDocuments({
      status: "Completed",
    });
    const totalPosts = await Post.countDocuments();

    const totalReplies_count = await Post.aggregate([
      { $project: { replyCount: { $size: "$replies" } } },
      { $group: { _id: null, total: { $sum: "$replyCount" } } },
    ]);

    let totalReplies = 0;
    if (totalReplies_count.length > 0) {
      totalReplies = totalReplies_count[0].total;
    }

    const allRatings = await Rating.find();
    let ratingSum = 0;
    for (let i = 0; i < allRatings.length; i++) {
      const r = allRatings[i];
      const singleAvg =
        (r.professionalism +
          r.clarity +
          r.empathy +
          r.helpfulness +
          r.overallSatisfaction) /
        5;
      ratingSum = ratingSum + singleAvg;
    }
    let averageRating = 0;
    if (allRatings.length > 0) {
      averageRating = (ratingSum / allRatings.length).toFixed(1);
    }

    const allQuizzes = await MoodQuiz.find();
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    for (let i = 0; i < allQuizzes.length; i++) {
      const label = allQuizzes[i].moodLabel;
      if (label === "Good") {
        positive = positive + 1;
      } else if (label === "Average") {
        neutral = neutral + 1;
      } else if (label === "Below Average" || label === "Very Low") {
        negative = negative + 1;
      }
    }

    const counselors = await User.find({
      role: "Counselor",
      status: "Approved",
    });

    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=MindCare_Report.pdf",
      );
      doc.pipe(res);

      doc.rect(0, 0, doc.page.width, 80).fill("#4f46e5");
      doc
        .fillColor("white")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("MindCare", 50, 20);
      doc
        .fontSize(11)
        .font("Helvetica")
        .text("Mental Health Support Platform — Analytics Report", 50, 50);

      doc.fillColor("#1f2937").moveDown(3);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#6b7280")
        .text("Report Period: All Time", 50, 100);
      doc.text("Generated On: " + new Date().toDateString(), 50, 115);

      doc
        .moveTo(50, 135)
        .lineTo(doc.page.width - 50, 135)
        .strokeColor("#e5e7eb")
        .stroke();
      doc.moveDown(1);
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#4f46e5")
        .text("1. Platform Overview", 50, 150);

      doc.moveDown(0.5);
      const overviewRows = [
        ["Total Registered Students", totalStudents],
        ["Total Approved Counselors", totalCounselors],
        ["Total Completed Sessions", totalSessions],
        ["Average Counselor Rating", averageRating + " / 5"],
      ];

      let y = 175;
      for (let i = 0; i < overviewRows.length; i++) {
        const bgColor = i % 2 === 0 ? "#f9fafb" : "#ffffff";
        doc.rect(50, y, doc.page.width - 100, 22).fill(bgColor);
        doc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(overviewRows[i][0], 60, y + 6);
        doc
          .fillColor("#1f2937")
          .font("Helvetica-Bold")
          .text(String(overviewRows[i][1]), 350, y + 6);
        y = y + 22;
      }

      doc
        .moveTo(50, y + 10)
        .lineTo(doc.page.width - 50, y + 10)
        .strokeColor("#e5e7eb")
        .stroke();
      y = y + 25;
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#4f46e5")
        .text("2. Community Forum", 50, y);

      y = y + 20;
      const forumRows = [
        ["Total Forum Posts", totalPosts],
        ["Total Forum Replies", totalReplies],
      ];

      for (let i = 0; i < forumRows.length; i++) {
        const bgColor = i % 2 === 0 ? "#f9fafb" : "#ffffff";
        doc.rect(50, y, doc.page.width - 100, 22).fill(bgColor);
        doc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(forumRows[i][0], 60, y + 6);
        doc
          .fillColor("#1f2937")
          .font("Helvetica-Bold")
          .text(String(forumRows[i][1]), 350, y + 6);
        y = y + 22;
      }

      doc
        .moveTo(50, y + 10)
        .lineTo(doc.page.width - 50, y + 10)
        .strokeColor("#e5e7eb")
        .stroke();

      y = y + 25;
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#4f46e5")
        .text("3. Student Mood Summary", 50, y);

      y = y + 20;
      const moodRows = [
        ["Positive Mood (Good)", positive],
        ["Neutral Mood (Average)", neutral],
        ["Negative Mood (Below Average / Very Low)", negative],
        ["Total Quiz Submissions", allQuizzes.length],
      ];

      for (let i = 0; i < moodRows.length; i++) {
        const bgColor = i % 2 === 0 ? "#f9fafb" : "#ffffff";
        doc.rect(50, y, doc.page.width - 100, 22).fill(bgColor);
        doc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(moodRows[i][0], 60, y + 6);
        doc
          .fillColor("#1f2937")
          .font("Helvetica-Bold")
          .text(String(moodRows[i][1]), 350, y + 6);
        y = y + 22;
      }

      doc
        .moveTo(50, y + 10)
        .lineTo(doc.page.width - 50, y + 10)
        .strokeColor("#e5e7eb")
        .stroke();

      y = y + 25;
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor("#4f46e5")
        .text("4. Counselor Performance", 50, y);

      y = y + 20;

      doc.rect(50, y, doc.page.width - 100, 22).fill("#4f46e5");
      doc
        .fillColor("white")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Counselor Name", 60, y + 6)
        .text("Avg Rating", 350, y + 6)
        .text("Total Ratings", 430, y + 6);
      y = y + 22;

      for (let i = 0; i < counselors.length; i++) {
        const counselorRatings = await Rating.find({
          counselorId: counselors[i]._id,
        });
        let sum = 0;
        for (let j = 0; j < counselorRatings.length; j++) {
          const r = counselorRatings[j];
          sum =
            sum +
            (r.professionalism +
              r.clarity +
              r.empathy +
              r.helpfulness +
              r.overallSatisfaction) /
              5;
        }
        let avg = 0;
        if (counselorRatings.length > 0) {
          avg = (sum / counselorRatings.length).toFixed(1);
        }

        const bgColor = i % 2 === 0 ? "#f9fafb" : "#ffffff";
        doc.rect(50, y, doc.page.width - 100, 22).fill(bgColor);
        doc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(counselors[i].name, 60, y + 6);
        doc
          .fillColor("#1f2937")
          .font("Helvetica-Bold")
          .text(avg + " / 5", 350, y + 6)
          .text(String(counselorRatings.length), 430, y + 6);
        y = y + 22;
      }

      doc
        .moveTo(50, y + 15)
        .lineTo(doc.page.width - 50, y + 15)
        .strokeColor("#e5e7eb")
        .stroke();
      doc
        .fillColor("#9ca3af")
        .fontSize(9)
        .font("Helvetica")
        .text(
          "This report is confidential and generated automatically by MindCare.",
          50,
          y + 25,
          { align: "center" },
        );

      doc.end();
      return;
    }

    res.status(400).json({ message: "Invalid format. Use ?format=pdf" });
  } catch (error) {
    res.status(500).json({ message: "Failed to download report", error });
  }
};

module.exports = {
  getOverview,
  getSessionAnalytics,
  getUserAnalytics,
  getForumAnalytics,
  downloadReport,
};
