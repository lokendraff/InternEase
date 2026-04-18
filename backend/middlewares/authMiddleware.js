const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes. Verifies the JWT token from headers.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB and attach to request object (excluding password)
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

/**
 * Middleware for Role-Based Access Control (RBAC).
 * @param  {...string} roles - Array of allowed roles (e.g., 'Organizer', 'Admin')
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };