const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{
        questionText: String,
        answerText: { type: String, default: "" }, // Student's response
        aiFeedback: String // Feedback for this specific answer
    }],
    overallScore: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);