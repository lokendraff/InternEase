const User = require('../models/User');
const { fetchLeetCodeStats, fetchCodeforcesStats } = require('../utils/codingProfiles');

/**
 * @desc    Get Student Profile with Live Coding Stats
 * @route   GET /api/users/profile
 * @access  Private (Student only)
 */
const getStudentProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user || user.role !== 'Student') {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }

        const lcStats = user.codingProfiles?.leetcodeHandle
            ? await fetchLeetCodeStats(user.codingProfiles.leetcodeHandle)
            : null;

        const cfStats = user.codingProfiles?.codeforcesHandle
            ? await fetchCodeforcesStats(user.codingProfiles.codeforcesHandle)
            : null;

        const profileData = {
            ...user._doc,
            liveStats: {
                leetcode: lcStats,
                codeforces: cfStats
            }
        };

        res.status(200).json(profileData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update Coding Handles
 * @route   PUT /api/users/profile/handles
 * @access  Private (Student only)
 */
const updateCodingHandles = async (req, res) => {
    try {
        const { leetcodeHandle, codeforcesHandle } = req.body;
        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'Student') {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }

        user.codingProfiles.leetcodeHandle = leetcodeHandle || user.codingProfiles.leetcodeHandle;
        user.codingProfiles.codeforcesHandle = codeforcesHandle || user.codingProfiles.codeforcesHandle;

        await user.save();

        res.status(200).json({ message: 'Handles updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

/**
 * @desc    Get top students for the Leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res) => {
    try {
        const topStudents = await User.find({ role: 'Student' })
            .sort({ 'gamification.xp': -1 })
            .limit(10)
            .select('name gamification.xp gamification.badges');

        res.status(200).json(topStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentProfile, updateCodingHandles, getLeaderboard };