const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); 
const sessionRoutes = require('./routes/sessionRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const forumRoutes = require('./routes/forumRoutes');
const quizRoutes = require('./routes/quizRoutes');
const path = require('path'); 

require('dotenv').config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use('/api/sessions', sessionRoutes);

app.use('/api/ratings', ratingRoutes);

app.use('/api/forum', forumRoutes);

app.use('/api/quiz', quizRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));