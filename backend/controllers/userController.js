const User = require('../models/User');

/**
 * @desc    Get top students for the Leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public (or Private based on your choice)
 */
const getLeaderboard = async (req, res) => {
    try {
        // Fetch users who are students, sort by XP descending, limit to top 10
        const topStudents = await User.find({ role: 'Student' })
            .sort({ 'gamification.xp': -1 })
            .limit(10)
            .select('name gamification.xp gamification.badges'); // Only send required fields

        res.status(200).json(topStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLeaderboard };