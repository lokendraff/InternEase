const express = require('express');
const { startMockInterview, submitAndEvaluateInterview } = require('../controllers/interviewController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/generate', protect, authorizeRoles('Student'), startMockInterview);
router.post('/:id/evaluate', protect, authorizeRoles('Student'), submitAndEvaluateInterview);

module.exports = router;