const express = require('express');
const { getStudentProfile, updateCodingHandles, getLeaderboard } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);

// Student Specific Routes
router.get('/profile', protect, authorizeRoles('Student'), getStudentProfile);
router.put('/profile/handles', protect, authorizeRoles('Student'), updateCodingHandles);

module.exports = router;