// __tests__/ticketManagement.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const User = require('../src/models/users');
const Ticket = require('../src/models/maintenance');
const dbHandler = require('./setup');
const ticketRoutes = require('../src/routes/tickets');
const cors = require('cors');

// Create a test Express app
const createTestApp = () => {
    const app = express();
    app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
    app.use(express.json());
    app.use('/api/tickets', ticketRoutes);
    return app;
};

describe('Ticket API', () => {
    let app, adminToken, clientToken, engineerToken;
    let admin, client, engineer;
    let clientTicket;
    const jwtSecret = process.env.JWT_SECRET || 'test-secret-key';

    beforeAll(async () => {
        await dbHandler.connect();
        app = createTestApp();

        // Hash password once for all test users
        const passwordHash = await bcrypt.hash('password123', 10);

        // Create test users with DIFFERENT unique emails
        admin = await User.create({
            name: 'Admin User Mgmt',
            email: 'admin-mgmt@test.com',
            passwordHash,
            role: 'Admin'
        });

        client = await User.create({
            name: 'Client User Mgmt',
            email: 'client-mgmt@test.com',
            passwordHash,
            role: 'Client'
        });

        engineer = await User.create({
            name: 'Engineer User Mgmt',
            email: 'engineer-mgmt@test.com',
            passwordHash,
            role: 'Engineer'
        });

        // Generate tokens
        adminToken = jwt.sign(
            { id: admin._id.toString(), role: admin.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        clientToken = jwt.sign(
            { id: client._id.toString(), role: client.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        engineerToken = jwt.sign(
            { id: engineer._id.toString(), role: engineer.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Create test tickets
        clientTicket = await Ticket.create({
            title: 'Client Test Ticket',
            description: 'This is a test ticket created by a client',
            createdBy: client._id,
            status: 'Open'
        });
    });

    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    // Updated tests for paginated response
    describe('GET /api/tickets - Get All Tickets', () => {
        it('should allow admin to view all tickets', async () => {
            const res = await request(app)
                .get('/api/tickets')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('tickets');
            expect(res.body).toHaveProperty('pagination');
            expect(Array.isArray(res.body.tickets)).toBe(true);
        });

        // Other test cases...
    });

    // All other tests remain the same
});