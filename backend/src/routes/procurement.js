// src/routes/procurement.js
const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizedRoles');

// Apply authentication to all routes
router.use(authenticateToken);

// Ticket-specific procurement routes
router.post('/tickets/:ticketId/procurements',
    authorizeRoles('Technician', 'Engineer'),
    procurementController.createProcurementItem);

router.get('/tickets/:ticketId/procurements',
    procurementController.getProcurementsByTicket);

// General procurement routes
router.get('/procurements',
    authorizeRoles('Admin', 'Engineer'),
    procurementController.getAllProcurements);

router.patch('/procurements/:itemId',
    procurementController.updateProcurementStatus);

module.exports = router;