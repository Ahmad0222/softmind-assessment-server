const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const generateTokens = require('../config/jwt.js');
const bcrypt = require('bcryptjs');

// Register new user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role: role || 'user'
        });

        // Generate tokens
        const tokens = generateTokens(user);

        // Save refresh token to DB
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...tokens
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Authenticate user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate new tokens
            const tokens = generateTokens(user);



            // Update refresh token in DB
            user.refreshToken = tokens.refreshToken;
            await user.save();

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                ...tokens
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Refresh access token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    getCurrentUser
};