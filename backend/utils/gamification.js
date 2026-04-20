const User = require('../models/User');

/**
 * Awards XP to a student and unlocks badges if thresholds are met.
 * @param {String} userId - The ID of the student
 * @param {Number} xpToAdd - Amount of XP to award
 */
const awardXPAndBadges = async (userId, xpToAdd) => {
    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'Student') return null;

        // Add XP
        user.gamification.xp += xpToAdd;
        const currentXp = user.gamification.xp;
        const newBadges = [];

        // Badge Unlocking Logic
        if (currentXp >= 100 && !user.gamification.badges.includes('Rising Star 🌟')) {
            newBadges.push('Rising Star 🌟');
        }
        if (currentXp >= 250 && !user.gamification.badges.includes('Pro Applicant 🔥')) {
            newBadges.push('Pro Applicant 🔥');
        }
        if (currentXp >= 500 && !user.gamification.badges.includes('Internship Guru 👑')) {
            newBadges.push('Internship Guru 👑');
        }

        // Add new badges to user profile if any were unlocked
        if (newBadges.length > 0) {
            user.gamification.badges.push(...newBadges);
        }

        await user.save();
        
        // Return summary for logging or notification purposes
        return { 
            totalXp: user.gamification.xp, 
            badgesUnlocked: newBadges 
        };
    } catch (error) {
        console.error("Gamification Error:", error.message);
    }
};

module.exports = { awardXPAndBadges };