const mongoose = require('mongoose');

// It connects to the MongoDB database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // It stops the server if connection fails
    }
};

module.exports = connectDB;