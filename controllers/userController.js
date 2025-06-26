import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Client from '../models/Client.js';

// Create new user
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Don't send password back
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Assign client to user
export const assignClientToUser = async (req, res) => {
    try {
        const { userId, clientId } = req.params;

        // Find user and client
        const user = await User.findById(userId);
        const client = await Client.findById(clientId);

        if (!user || !client) {
            return res.status(404).json({ error: 'User or client not found' });
        }

        // Update client assignment
        client.assignedTo = userId;
        await client.save();

        // Add to user's assigned clients
        if (!user.assignedClients.includes(clientId)) {
            user.assignedClients.push(clientId);
            await user.save();
        }

        res.json({
            message: 'Client assigned successfully',
            clientId,
            userId
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        let users = await User.find().select('-password').populate({
            path: 'assignedClients',
            select: 'clientName renewalDate',
        }).lean();

        users = users.reverse(); // Reverse the order

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user's assigned clients
export const getUserClients = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'assignedClients',
                populate: {
                    path: 'licenseType',
                    select: 'name'
                }
            })
            .select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user.assignedClients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}