const express = require('express');
const { getOrganizerAnalytics } = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only Organizers can view their dashboard analytics
router.get('/organizer', protect, authorizeRoles('Organizer'), getOrganizerAnalytics);

module.exports = router;