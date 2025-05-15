// __tests__/assignedTickets.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

describe('Assigned Tickets Endpoint', () => {
    let adminToken, clientToken, technicianToken, engineerToken;
    let admin, client, technician, engineer;
    let technicianTicket, engineerTicket;
    let app;
    const jwtSecret = process.env.JWT_SECRET || 'test-secret-key';

    beforeAll(async () => {
        await dbHandler.connect();
        app = createTestApp();

        // Hash password once for all test users
        const passwordHash = await bcrypt.hash('password123', 10);

        // Create test users with UNIQUE email addresses
        admin = await User.create({
            name: 'Admin User Assigned',
            email: 'admin-assigned@test.com',
            passwordHash,
            role: 'Admin'
        });

        client = await User.create({
            name: 'Client User Assigned',
            email: 'client-assigned@test.com',
            passwordHash,
            role: 'Client'
        });

        technician = await User.create({
            name: 'Technician User',
            email: 'technician-assigned@test.com',
            passwordHash,
            role: 'Technician'
        });

        engineer = await User.create({
            name: 'Engineer User Assigned',
            email: 'engineer-assigned@test.com',
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

        technicianToken = jwt.sign(
            { id: technician._id.toString(), role: technician.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        engineerToken = jwt.sign(
            { id: engineer._id.toString(), role: engineer.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Create test tickets
        technicianTicket = await Ticket.create({
            title: 'Technician Assigned Ticket',
            description: 'This ticket is assigned to a technician',
            createdBy: client._id,
            assignedTo: technician._id,
            status: 'In Progress'
        });

        engineerTicket = await Ticket.create({
            title: 'Engineer Assigned Ticket',
            description: 'This ticket is assigned to an engineer',
            createdBy: client._id,
            assignedTo: engineer._id,
            status: 'In Progress'
        });
    });

    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    describe('GET /api/tickets/assigned', () => {
        it('should allow technician to view tickets assigned to them', async () => {
            const res = await request(app)
                .get('/api/tickets/assigned')
                .set('Authorization', `Bearer ${technicianToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Technician Assigned Ticket');
        });

        it('should allow engineer to view tickets assigned to them', async () => {
            const res = await request(app)
                .get('/api/tickets/assigned')
                .set('Authorization', `Bearer ${engineerToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Engineer Assigned Ticket');
        });

        it('should not allow client to access assigned tickets endpoint', async () => {
            const res = await request(app)
                .get('/api/tickets/assigned')
                .set('Authorization', `Bearer ${clientToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message');
        });

        it('should not allow admin to access assigned tickets endpoint', async () => {
            const res = await request(app)
                .get('/api/tickets/assigned')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message');
        });

        it('should reject request with no token', async () => {
            const res = await request(app)
                .get('/api/tickets/assigned');

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Missing token');
        });
    });
});