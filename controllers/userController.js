const User = require('../models/User.js');
const { generateTokens } = require('../config/jwt.js');
const bcrypt = require('bcryptjs');


// @desc    Get all users (admin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role || user.role;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getUsers,
    updateUserRole
};