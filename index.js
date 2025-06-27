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
import { handleWebhook } from './controllers/webhookController.js';

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
// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);

app.post('/api/webhooks/renewals', handleWebhook);


// API routes with protection
app.use('/api', protect, apiRoutes);

// Admin-only routes
app.post('/api/users', admin);
app.post('/api/license-types', admin);
app.put('/api/license-types/:id', admin);

// Static files and client routing - LAST
app.use(express.static(path.join(__dirname, 'Client/dist')));

// Fixed wildcard route with named parameter
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/dist/index.html'));
});


// Error Handling - must come BEFORE static files
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});