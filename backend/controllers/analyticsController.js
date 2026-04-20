const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

/**
 * @desc    Get dashboard analytics for the logged-in Organizer
 * @route   GET /api/analytics/organizer
 * @access  Private (Organizer only)
 */
const getOrganizerAnalytics = async (req, res) => {
    try {
        const organizerId = req.user._id;

        // 1. Find all opportunities created by this organizer
        const opportunities = await Opportunity.find({ organizerId });
        const opportunityIds = opportunities.map(opp => opp._id);

        if (opportunityIds.length === 0) {
            return res.status(200).json({
                totalOpportunities: 0,
                totalApplications: 0,
                averageATS: 0,
                breakdown: { Applied: 0, 'In-Review': 0, Interview: 0, Selected: 0, Rejected: 0 }
            });
        }

        // 2. Count total applications for these opportunities
        const totalApplications = await Application.countDocuments({ opportunityId: { $in: opportunityIds } });

        // 3. MongoDB Aggregation Pipeline for average score and status breakdown (for Pie Charts)
        const stats = await Application.aggregate([
            { $match: { opportunityId: { $in: opportunityIds } } },
            {
                $group: {
                    _id: null,
                    averageATS: { $avg: "$atsScore" },
                    applied: { $sum: { $cond: [{ $eq: ["$status", "Applied"] }, 1, 0] } },
                    inReview: { $sum: { $cond: [{ $eq: ["$status", "In-Review"] }, 1, 0] } },
                    interview: { $sum: { $cond: [{ $eq: ["$status", "Interview"] }, 1, 0] } },
                    selected: { $sum: { $cond: [{ $eq: ["$status", "Selected"] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } }
                }
            }
        ]);

        const analytics = stats.length > 0 ? stats[0] : {
            averageATS: 0, applied: 0, inReview: 0, interview: 0, selected: 0, rejected: 0
        };

        // 4. Send formatted JSON response
        res.status(200).json({
            totalOpportunities: opportunities.length,
            totalApplications,
            averageATS: Math.round(analytics.averageATS || 0), // Round off the ATS score
            breakdown: {
                Applied: analytics.applied,
                'In-Review': analytics.inReview,
                Interview: analytics.interview,
                Selected: analytics.selected,
                Rejected: analytics.rejected
            }
        });
    } catch (error) {
        console.error("Analytics Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrganizerAnalytics };