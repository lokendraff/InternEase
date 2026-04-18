const express = require('express');
const { createOpportunity, getOpportunities } = require('../controllers/opportunityController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public/Student route
router.get('/', getOpportunities);

// Protected route: Only logged-in users with 'Organizer' role can post
router.post('/', protect, authorizeRoles('Organizer'), createOpportunity);

module.exports = router;