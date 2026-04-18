const mongoose = require('mongoose');

//application schema
const applicationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    
    // status of application to decide the column in kanban board
    status: { 
        type: String, 
        enum: ['Applied', 'In-Review', 'Interview', 'Selected', 'Rejected'], 
        default: 'Applied' 
    },
    
    // ats score and ai feedback
    atsScore: { type: Number, default: null },
    aiFeedback: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);