const express = require('express');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
    createOpportunity,
    getAllOpportunities, // <-- Sahi naam 
    getOpportunityById,
    getLiveExternalJobs
} = require('../controllers/opportunityController');

const router = express.Router();

// 1. Static Custom Routes (Hamesha Upar)
router.get('/live', getLiveExternalJobs);

// 2. Base Routes
router.get('/', getAllOpportunities); // <-- Yahan naam fix kiya
router.post('/', protect, authorizeRoles('Organizer'), createOpportunity);

// 3. Dynamic Routes (Hamesha Niche)
router.get('/:id', getOpportunityById);

module.exports = router;