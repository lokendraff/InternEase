const express = require('express');
const { 
    applyForOpportunity, 
    getApplicationsForOpportunity, 
    updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for Students to apply
router.post('/', protect, authorizeRoles('Student'), applyForOpportunity);

// Routes for Organizers to manage Kanban board
router.get('/opportunity/:opportunityId', protect, authorizeRoles('Organizer'), getApplicationsForOpportunity);
router.patch('/:id/status', protect, authorizeRoles('Organizer'), updateApplicationStatus);

module.exports = router;