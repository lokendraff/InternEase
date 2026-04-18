const Opportunity = require('../models/Opportunity');

/**
 * @desc    Create a new internship or event
 * @route   POST /api/opportunities
 * @access  Private (Organizer only)
 */
const createOpportunity = async (req, res) => {
    try {
        const { title, description, skillsRequired, type } = req.body;

        // Create opportunity linked to the currently logged-in Organizer
        const opportunity = await Opportunity.create({
            organizerId: req.user._id, // Comes from the 'protect' middleware
            title,
            description,
            skillsRequired,
            type
        });

        res.status(201).json(opportunity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all active opportunities
 * @route   GET /api/opportunities
 * @access  Public (or Private for Students)
 */
const getOpportunities = async (req, res) => {
    try {
        // Only fetch opportunities that are 'Open'
        const opportunities = await Opportunity.find({ status: 'Open' })
            .populate('organizerId', 'name email'); // Join user data to get organizer's name

        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOpportunity, getOpportunities };