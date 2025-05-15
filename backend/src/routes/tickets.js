// src/routes/tickets.js
const express = require('express');
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    getMyTickets,
    getAssignedTickets,
    updateTicket,
    getTicketById
} = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');
const authorizeRoles = require('../middleware/authorizedRoles');
const authenticateToken = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Define specific path routes first
router.post('/', authorizeRoles('Client'), createTicket);
router.get('/', authorizeRoles('Admin', 'Engineer'), getAllTickets);
router.get('/my', authorizeRoles('Client'), getMyTickets);
// Only technicians should get assigned tickets; engineers assign but are not assigned
router.get('/assigned', authorizeRoles('Technician'), getAssignedTickets);

// Comments endpoints
router.post('/:ticketId/comments', commentController.addComment);
router.get('/:ticketId/comments', commentController.getTicketComments);

// Parameter routes come last
router.get('/:id', getTicketById);
router.patch('/:id', updateTicket);

module.exports = router;