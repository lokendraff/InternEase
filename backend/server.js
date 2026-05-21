const express = require('express');
const dotenv = require('dotenv');
// Load env vars
dotenv.config();
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db.js');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const applicationRoutes = require('./routes/applicationRoutes');    
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect to Database
connectDB();

const app = express();

// Middlewares
// CORS Configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: { message: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter to all routes
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('InternEase API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
    });
}

module.exports = app;