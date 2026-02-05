const Appointment = require('../models/Appointment');

// It handles the request for a new session from the student
exports.requestSession = async (req, res) => {
    try {
        const { counselorId, date, timeSlot, reason } = req.body;
        const studentId = req.user.id; 

        // It checks if the counselor is available at that time
        const existingAppointment = await Appointment.findOne({
            counselorId,
            date,
            timeSlot,
            status: { $in: ['Pending', 'Approved'] }
        });

        // It stops the booking if the slot is already taken
        if (existingAppointment) {
            return res.status(400).json({ 
                message: "Counselor is not available at this time. Please choose a different time." 
            });
        }

        // It sends the request to the counselor
        const newAppointment = new Appointment({
            studentId,
            counselorId,
            date,
            timeSlot,
            reason,
            status: 'Pending'
        });

        await newAppointment.save();
        res.status(201).json({ message: "Request Sent! Counselor will respond soon." });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// It checks the status of a counselor for a specific date (Green/Yellow/Red logic one)
exports.checkAvailability = async (req, res) => {
    try {
        const { counselorId, date } = req.query;

        // It finds all sessions for a counselor on a specific date
        const bookings = await Appointment.find({ counselorId, date });

        // It returns the status of a counselor for a specific date
        res.status(200).json(bookings);
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
        // It fetches sessions based on whether the user is a Student or Counselor
        if (role === 'Student') {
            sessions = await Appointment.find({ studentId: userId }).populate('counselorId', 'name email');
        } else if (role === 'Counselor') {
            sessions = await Appointment.find({ counselorId: userId }).populate('studentId', 'name email');
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

        // It checks if the counselor is the one who made the request
        const appointment = await Appointment.findOne({ _id: appointmentId, counselorId });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        // It updates the status in the database
        appointment.status = status;
        await appointment.save();

        // It sends a message based on the status
        let message = "";
        if (status === 'Approved') {
            message = `Request Approved! The Session is on ${appointment.date} at ${appointment.timeSlot}!`;
        } else {
            message = `Your Request for ${appointment.date} at ${appointment.timeSlot} was not accepted.`;
        }

        res.status(200).json({ message, appointment });

    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

// It fetches all pending requests for a counselor
exports.getPendingRequests = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const pending = await Appointment.find({ counselorId, status: 'Pending' })
            .populate('studentId', 'name email');
            
        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending requests" });
    }
};