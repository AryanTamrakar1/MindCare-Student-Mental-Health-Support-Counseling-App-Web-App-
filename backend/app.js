require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const forumRoutes = require("./routes/forumRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { startNotificationScheduler } = require("./utils/notificationScheduler");
const gamificationRoutes = require("./routes/gamificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const moodAnalysisRoutes = require("./routes/moodAnalysisRoutes");
const moodPredictionRoutes = require("./routes/moodPredictionRoutes");
const counselorMatchRoutes = require("./routes/counselorMatchRoutes");
const resourceMatchRoutes = require("./routes/resourceMatchRoutes");
const smartQuizRoutes = require("./routes/smartQuizRoutes");
const path = require("path");

connectDB();
startNotificationScheduler();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/sessions", sessionRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/forum", forumRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/gamification", gamificationRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/smart/mood-analysis", moodAnalysisRoutes);

app.use("/api/smart/mood-prediction", moodPredictionRoutes);

app.use("/api/smart/counselor-match", counselorMatchRoutes);

app.use("/api/smart/resource-match", resourceMatchRoutes);

app.use("/api/smart/smart-quiz", smartQuizRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
