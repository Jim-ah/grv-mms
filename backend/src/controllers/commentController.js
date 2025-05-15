// src/controllers/commentController.js
const commentService = require('../services/commentService');
const ticketService = require('../services/ticketService');

exports.addComment = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { content, isInternal } = req.body;

        // Check if ticket exists
        const ticket = await ticketService.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Clients can only comment on their own tickets
        if (req.user.role === 'Client') {
            if (ticket.createdBy._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
            // Clients cannot create internal comments
            if (isInternal) {
                return res.status(403).json({ message: 'Clients cannot create internal comments' });
            }
        }

        const comment = await commentService.createComment(
            ticketId,
            req.user.id,
            content,
            isInternal || false
        );

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTicketComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Check if ticket exists
        const ticket = await ticketService.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Clients can only view comments on their own tickets
        if (req.user.role === 'Client' &&
            ticket.createdBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const comments = await commentService.getCommentsByTicket(ticketId, req.user.role);
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};