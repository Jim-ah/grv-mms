// src/routes/admin.js
const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticketService');
const procurementService = require('../services/procurementService');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizedRoles');

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(authorizeRoles('Admin'));

// Get all tickets (admin only)
router.get('/tickets', async (req, res) => {
    try {
        const result = await ticketService.getAllTickets(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all procurements (admin only)
router.get('/procurements', async (req, res) => {
    try {
        const procurements = await procurementService.getAllProcurements(req.query);
        res.status(200).json(procurements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;