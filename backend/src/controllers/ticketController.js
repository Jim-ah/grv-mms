// src/controllers/ticketController.js
const ticketService = require('../services/ticketService');

exports.createTicket = async (req, res) => {
  try {
    if (req.user.role !== 'Client') {
      return res.status(403).json({ message: 'Only clients can create tickets.' });
    }

    const ticket = await ticketService.createTicket(
        req.user.id,
        req.body.title,
        req.body.description,
        req.body.priority,
    );

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, priority, assignedTo, search, sort, order, page, limit } = req.query;

    const result = await ticketService.getAllTickets({
      status, priority, assignedTo, search, sort, order, page, limit
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTicketsByUser(req.user.id);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Addition to src/controllers/ticketController.js for deadline management
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check for required role based on update type
    if (req.user.role === 'Client') {
      if (ticket.createdBy._id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Clients can only update description
      if (Object.keys(updates).some(key => key !== 'description')) {
        return res.status(403).json({ message: 'Clients can only update ticket description' });
      }
    } else if (req.user.role === 'Engineer') {
      // Engineers can assign tickets, set priorities, and set deadlines
      if (Object.keys(updates).some(key => !['assignedTo', 'priority', 'deadline'].includes(key))) {
        return res.status(403).json({ message: 'Engineers can only assign tickets, set priorities, and deadlines' });
      }
    } else if (req.user.role === 'Technician') {
      // Technicians can only update status
      if (Object.keys(updates).some(key => key !== 'status')) {
        return res.status(403).json({ message: 'Technicians can only update ticket status' });
      }
    } else if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized role for this action' });
    }

    const updatedTicket = await ticketService.updateTicket(id, updates, req.user);
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions - clients can only view their own tickets
    if (req.user.role === 'Client' &&
        ticket.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// New function for technicians to get assigned tickets
exports.getAssignedTickets = async (req, res) => {
  try {
    if (!['Technician', 'Engineer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tickets = await ticketService.getTicketsByAssignee(req.user.id);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};