// src/controllers/procurementController.js
const procurementService = require('../services/procurementService');
const ticketService = require('../services/ticketService');

exports.createProcurementItem = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { itemName, quantity, estimatedCost } = req.body;

        // Verify ticket exists
        const ticket = await ticketService.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Only technicians can request items for tickets assigned to them
        if (req.user.role === 'Technician' &&
            (!ticket.assignedTo || ticket.assignedTo._id.toString() !== req.user.id)) {
            return res.status(403).json({ message: 'You can only request items for tickets assigned to you' });
        }

        // Mark the ticket as requiring procurement
        await ticketService.updateTicket(ticketId, { procurementRequired: true }, req.user);

        const procurementData = {
            ticketId,
            itemName,
            quantity,
            estimatedCost,
            requestedBy: req.user.id,
            status: 'Requested'
        };

        const procurement = await procurementService.createProcurementItem(procurementData);
        res.status(201).json(procurement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProcurementsByTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Verify ticket exists
        const ticket = await ticketService.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Clients can only view procurements for their tickets
        if (req.user.role === 'Client' &&
            ticket.createdBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const procurements = await procurementService.getProcurementsByTicket(ticketId);
        res.status(200).json(procurements);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProcurementStatus = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { status } = req.body;

        // Only engineers or admins can approve/reject procurement requests
        if (['Approved', 'Rejected'].includes(status) &&
            !['Engineer', 'Admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only engineers or admins can approve/reject procurement requests' });
        }

        // Only technicians can mark items as received
        if (status === 'Received' && req.user.role !== 'Technician') {
            return res.status(403).json({ message: 'Only technicians can mark items as received' });
        }

        const procurement = await procurementService.updateProcurementStatus(itemId, status, req.user.id);
        if (!procurement) {
            return res.status(404).json({ message: 'Procurement item not found' });
        }

        res.status(200).json(procurement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllProcurements = async (req, res) => {
    try {
        // Only admin and engineers can view all procurements
        if (!['Admin', 'Engineer'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status } = req.query;
        const procurements = await procurementService.getAllProcurements({ status });
        res.status(200).json(procurements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};