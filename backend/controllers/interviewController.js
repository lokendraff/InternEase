const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const { generateInterviewQuestions, evaluateInterviewAnswers } = require('../utils/gemini');

/**
 * @desc    Generate Mock Interview Questions for a specific application
 * @route   POST /api/interviews/generate
 * @access  Private (Student only)
 */
const startMockInterview = async (req, res) => {
    try {
        const { applicationId } = req.body;

        // Verify application exists and belongs to student
        const application = await Application.findById(applicationId).populate('opportunityId');
        if (!application || application.studentId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Application not found or unauthorized' });
        }

        // Check if interview already exists
        const existingInterview = await Interview.findOne({ applicationId });
        if (existingInterview) {
            return res.status(400).json({ message: 'Interview already generated', interview: existingInterview });
        }

        // Generate AI Questions based on JD
        const aiQuestions = await generateInterviewQuestions(application.opportunityId.description);
        
        // Format for DB
        const questionsForDb = aiQuestions.map(q => ({ questionText: q }));

        const interview = await Interview.create({
            applicationId,
            studentId: req.user._id,
            questions: questionsForDb
        });

        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Submit answers and get AI evaluation
 * @route   POST /api/interviews/:id/evaluate
 * @access  Private (Student only)
 */
const submitAndEvaluateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // Array of answer strings corresponding to questions

        const interview = await Interview.findById(id);
        if (!interview || interview.isCompleted) {
            return res.status(400).json({ message: 'Interview not found or already completed' });
        }

        // Prepare data for AI
        const qnaArray = interview.questions.map((q, index) => ({
            questionText: q.questionText,
            answerText: answers[index] || ""
        }));

        // Get AI Evaluation
        const { overallScore, feedbackArray } = await evaluateInterviewAnswers(qnaArray);

        // Update DB
        interview.questions.forEach((q, index) => {
            q.answerText = answers[index] || "";
            q.aiFeedback = feedbackArray[index] || "No feedback generated.";
        });
        interview.overallScore = overallScore;
        interview.isCompleted = true;

        await interview.save();

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { startMockInterview, submitAndEvaluateInterview };