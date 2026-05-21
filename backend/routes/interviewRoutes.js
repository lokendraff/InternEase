const express = require('express');
const { startMockInterview, submitAndEvaluateInterview, startJDInterview, evaluateJDInterview } = require('../controllers/interviewController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// ── Static routes MUST come before parameterized routes ──

// New: JD-based interview (no applicationId needed)
router.post('/start', protect, authorizeRoles('Student'), startJDInterview);
router.post('/evaluate', protect, authorizeRoles('Student'), evaluateJDInterview);

// Legacy: Application-based interview
router.post('/generate', protect, authorizeRoles('Student'), startMockInterview);
router.post('/:id/evaluate', protect, authorizeRoles('Student'), submitAndEvaluateInterview);

module.exports = router;