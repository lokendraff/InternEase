const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText, skillsRequired) => {
    try {
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

        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(responseText);
        return {
            atsScore: parsedData.atsScore || 0,
            feedback: parsedData.feedback || "Unable to generate feedback."
        };
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        return { atsScore: 0, feedback: "AI Analysis failed temporarily." };
    }   
};

const generateInterviewQuestions = async (jobDescription) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // FIXED HERE
        const prompt = `
            Act as a Senior Technical Interviewer. Based on this Job Description: "${jobDescription}", 
            generate 5 relevant technical interview questions for a candidate.
            Return ONLY a JSON array of strings. No extra text.
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini Interview Error:", error);
        return ["Describe your technical stack.", "How do you handle complex bugs?", "Explain a project you're proud of."];
    }
};

const evaluateInterviewAnswers = async (qnaArray) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
            Act as a strict but fair Technical Interviewer. 
            Evaluate the following Questions and the Candidate's Answers:
            ${JSON.stringify(qnaArray)}
            
            Provide the output STRICTLY as a JSON object with two keys:
            1. "overallScore": A number from 0 to 100 rating their overall performance.
            2. "feedbackArray": An array of strings, where each string is a 1-sentence feedback for the corresponding answer (pointing out what was good or missing).
            
            Return ONLY the JSON object, no markdown tags.
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        return { overallScore: 0, feedbackArray: qnaArray.map(() => "Evaluation failed temporarily.") };
    }
};

module.exports = { analyzeResume, generateInterviewQuestions, evaluateInterviewAnswers };