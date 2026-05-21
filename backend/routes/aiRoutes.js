const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/aiController');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/ai/analyze-resume
router.post('/analyze-resume', upload.single('resume'), analyzeResume);

module.exports = router;
