const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    //-- Link to the Student --
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    //-- Link to the Counselor --
    counselorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    //-- Date and Time --
    date: { 
        type: String, 
        required: true 
    },
    timeSlot: { 
        type: String, 
        required: true 
    },

    //-- Reason for the session --
    reason: { 
        type: String, 
        required: true 
    },

    //-- Status of the appointment --
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Declined'], 
        default: 'Pending' 
    }
    
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);