const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/aiController');

// Set up multer for memory storage with a 5MB file size limit
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max size
});

// POST /api/ai/analyze-resume
router.post('/analyze-resume', upload.single('resume'), analyzeResume);

module.exports = router;
