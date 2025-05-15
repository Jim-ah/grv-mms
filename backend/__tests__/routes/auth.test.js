const request = require('supertest');
const express = require('express');
const authRouter = require('../../src/routes/auth');
const userService = require('../../src/services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import test setup
require('../setup');

// Mock dependencies
jest.mock('../../src/services/userService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
    describe('POST /api/auth/login', () => {
        it('should return a token when credentials are valid', async () => {
            // Mock user service and bcrypt
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                passwordHash: 'hashedpw',
                role: 'Client'
            };

            userService.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock-token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mock-token');
        });

        it('should return 401 when credentials are invalid', async () => {
            userService.findByEmail.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrong@example.com', password: 'wrongpw' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
});