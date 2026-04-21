const Opportunity = require('../models/Opportunity');
const { fetchExternalInternships } = require('../utils/jobFetcher');

/**
 * @desc    Get live external internships/jobs (from JSearch)
 * @route   GET /api/opportunities/live
 * @access  Public or Private (Students)
 */
const getLiveExternalJobs = async (req, res) => {
    try {
        const keyword = req.query.query || 'Software Engineering Internship India';
        const rawJobs = await fetchExternalInternships(keyword);

        const formattedJobs = rawJobs.map(job => ({
            _id: job.job_id, 
            title: job.job_title,
            company: job.employer_name,
            description: job.job_description ? job.job_description.substring(0, 150) + '...' : 'No description',
            location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote' : 'Not Specified'),
            applyLink: job.job_apply_link, 
            isExternal: true 
        }));

        res.status(200).json(formattedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create a new internship or event
 * @route   POST /api/opportunities
 * @access  Private (Organizer only)
 */
const createOpportunity = async (req, res) => {
    try {
        const { title, description, skillsRequired, type } = req.body;
        const opportunity = await Opportunity.create({
            organizerId: req.user._id, 
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
// FIX 1: Naam theek kar diya (getAllOpportunities)
const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find({ status: 'Open' })
            .populate('organizerId', 'name email'); 
        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get single opportunity by ID
 * @route   GET /api/opportunities/:id
 */
// FIX 2: Ye function missing tha, maine add kar diya hai
const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
            .populate('organizerId', 'name email');
        if (opportunity) {
            res.status(200).json(opportunity);
        } else {
            res.status(404).json({ message: 'Opportunity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createOpportunity, 
    getAllOpportunities, 
    getOpportunityById, 
    getLiveExternalJobs
};