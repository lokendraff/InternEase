const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured' });
    }

    // 1. Extract text from PDF buffer
    let extractedText;
    try {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      return res.status(400).json({ message: 'Failed to extract text from PDF. Please ensure it is a valid PDF.' });
    }

    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ message: 'No text could be extracted from the PDF.' });
    }

    // 2. Prepare Gemini Prompt
    const prompt = `Analyze this resume text. You must return ONLY a JSON object with this exact structure: 
{ 
  "score": <number 1-100 ATS score>, 
  "keywordsFound": [<array of tech keywords>], 
  "formatting": "<string evaluating structure>", 
  "improvements": [<array of 3-4 actionable tips>] 
}. 
Do not use markdown blocks, just raw JSON. 
Resume Text: 
${extractedText}`;

    // 3. Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 4. Clean up and parse the response
    // Sometimes Gemini wraps JSON in markdown even if told not to
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (err) {
      console.error("JSON Parsing Error on Gemini Response:", err, text);
      return res.status(500).json({ message: 'Failed to parse AI response into valid JSON.', rawResponse: text });
    }

    // 5. Send back to frontend
    res.json(parsedData);

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ message: 'Server error during resume analysis', error: error.message });
  }
};

module.exports = {
  analyzeResume
};
