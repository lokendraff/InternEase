const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes a resume against required skills and returns an ATS score and feedback.
 * @param {string} resumeText - The parsed text from the student's resume.
 * @param {Array} skillsRequired - Array of skills required for the internship.
 * @returns {Object} { atsScore: Number, feedback: String }
 */
const analyzeResume = async (resumeText, skillsRequired) => {
    try {
        // Using the fast flash model for quick API responses
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });   
        const prompt = `
            You are an expert HR ATS (Applicant Tracking System).
            Analyze the following resume text against the required skills for an internship.
            
            Required Skills: ${skillsRequired.join(', ')}
            
            Resume Text:
            "${resumeText}"
            
            Provide the output STRICTLY as a JSON object with exactly two keys:
            1. "atsScore": A number from 0 to 100 representing the match percentage.
            2. "feedback": A brief 1-2 sentence actionable feedback for the candidate on what skills they are missing or what is good.
            
            Do not include markdown tags like \`\`\`json or any other text. Return ONLY the JSON object.
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean up markdown formatting if Gemini adds it accidentally
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(responseText);
        return {
            atsScore: parsedData.atsScore || 0,
            feedback: parsedData.feedback || "Unable to generate feedback."
        };
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        // Fallback response so the application process doesn't crash completely
        return { atsScore: 0, feedback: "AI Analysis failed temporarily." };
    }
};

module.exports = { analyzeResume };