const axios = require('axios');

/**
 * Fetch LeetCode stats using a community API wrapper
 */
const fetchLeetCodeStats = async (handle) => {
    try {
        if (!handle) return null;
        
        // Fetch total solved
        const solvedRes = await axios.get(`https://alfa-leetcode-api.onrender.com/${handle}/solved`);
        // Fetch ranking from main profile
        const profileRes = await axios.get(`https://alfa-leetcode-api.onrender.com/${handle}`);
        
        return {
            totalSolved: solvedRes.data.solvedProblem || 0,
            ranking: profileRes.data.ranking || 0
        };
    } catch (error) {
        console.error("LeetCode API Error:", error.message);
        return null;
    }
};

/**
 * Fetch Codeforces stats using official API
 */
const fetchCodeforcesStats = async (handle) => {
    try {
        if (!handle) return null;
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (response.data.status === "OK") {
            const data = response.data.result[0];
            return {
                rating: data.rating || 0,
                rank: data.rank || "unranked"
            };
        }
        return null;
    } catch (error) {
        console.error("Codeforces API Error:", error.message);
        return null;
    }
};

module.exports = { fetchLeetCodeStats, fetchCodeforcesStats };