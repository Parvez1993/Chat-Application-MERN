// File: routes/server.js
import express from 'express';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Example route
router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Example async route with error handling
router.get('/async-example', async (req, res, next) => {
    try {
        // Simulating async operation
        const data = await Promise.resolve({ message: 'Async operation successful' });
        res.json(data);
    } catch (error) {
        next(new AppError('Async operation failed', 500));
    }
});

// Example route that demonstrates throwing an error
router.get('/error-example', (req, res, next) => {
    try {
        // Simulating an error
        throw new Error('This is a test error');
    } catch (error) {
        next(new AppError('Something went wrong', 400));
    }
});

export default router;