import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import './config/reminderCron.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { login, register } from './controllers/authController.js';
import { protect, admin } from './middleware/auth.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api', apiRoutes);
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);

// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);

// Protected routes
app.use('/api', protect); // Apply to all API routes

// Admin-only routes
app.post('/api/users', admin);
app.post('/api/license-types', admin);
app.put('/api/license-types/:id', admin);

// Now you can safely use __dirname:
app.use(notFound);
app.use(errorHandler);

// Static files and client routing - SHOULD BE LAST
app.use(express.static(path.join(__dirname, 'Client/dist')));

console.log('Static files served from:', path.join(__dirname, 'Client/dist'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/dist/index.html'));
});



// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});