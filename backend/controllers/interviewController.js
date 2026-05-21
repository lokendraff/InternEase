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

/**
 * @desc    Start a JD-based mock interview (no applicationId needed)
 * @route   POST /api/interviews/start
 * @access  Private (Student only)
 */
const startJDInterview = async (req, res) => {
    try {
        const { jobDescription, interviewType } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: 'Job Description is required.' });
        }

        const type = interviewType || 'technical';

        // Enhance the prompt based on interview type
        const typePrompt = type === 'behavioral'
            ? `Focus on behavioral and situational questions (STAR method). Job Description: "${jobDescription}"`
            : jobDescription;

        // Generate AI Questions from raw JD text
        const aiQuestions = await generateInterviewQuestions(typePrompt);

        // Ensure exactly 5 questions
        const finalQuestions = aiQuestions.slice(0, 5);

        // Save to DB
        const interview = await Interview.create({
            studentId: req.user._id,
            jobDescription: jobDescription.trim(),
            interviewType: type,
            questions: finalQuestions.map(q => ({ questionText: q })),
        });

        // Return flat question strings for the frontend
        res.status(201).json({
            interviewId: interview._id,
            questions: finalQuestions,
        });
    } catch (error) {
        console.error('startJDInterview Error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Evaluate a JD-based interview (stateless — no DB lookup needed)
 * @route   POST /api/interviews/evaluate
 * @access  Private (Student only)
 */
const evaluateJDInterview = async (req, res) => {
    try {
        const { jobDescription, interviewType, qna } = req.body;
        // qna = [{ question: "...", answer: "..." }, ...]

        if (!qna || !Array.isArray(qna) || qna.length === 0) {
            return res.status(400).json({ message: 'Q&A data is required.' });
        }

        // Format for the Gemini evaluator
        const qnaArray = qna.map(item => ({
            questionText: item.question,
            answerText: item.answer || ""
        }));

        // Get AI Evaluation
        const { overallScore, feedbackArray } = await evaluateInterviewAnswers(qnaArray);

        // Build response with per-question feedback
        const feedback = qna.map((item, i) => ({
            question: item.question,
            answer: item.answer || '',
            aiFeedback: feedbackArray[i] || 'No feedback generated.',
        }));

        res.status(200).json({
            overallScore,
            feedback,
        });
    } catch (error) {
        console.error('evaluateJDInterview Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { startMockInterview, submitAndEvaluateInterview, startJDInterview, evaluateJDInterview };