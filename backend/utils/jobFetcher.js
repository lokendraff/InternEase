const axios = require('axios');

const fetchExternalInternships = async (searchQuery) => {
    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: searchQuery,
            page: '1',
            num_pages: '1'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data.data; // API returns jobs inside 'data' array
    } catch (error) {
        console.error("External Job API Error:", error.message);
        return [];
    }
};

module.exports = { fetchExternalInternships };