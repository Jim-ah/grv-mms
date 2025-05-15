// src/services/ticketService.js
const Ticket = require("../models/maintenance");
const mongoose = require("mongoose"); // Add this import

const createTicket = async (userId, title, description,priority) => {
    const ticket = new Ticket({
        title,
        description,
        createdBy: userId,
        priority: priority,
    });
    await ticket.save();
    return ticket;
};

const getAllTickets = async (queryOptions = {}) => {
    const {
        status,
        priority,
        assignedTo,
        search,
        sort = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 10
    } = queryOptions;

    // Build filter query
    const query = {};

    if (status) {
        query.status = status;
    }

    if (priority) {
        query.priority = priority;
    }

    if (assignedTo) {
        query.assignedTo = assignedTo;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const tickets = await Ticket.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ [sort]: order })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    // Get total count for pagination info
    const total = await Ticket.countDocuments(query);

    return {
        tickets,
        pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            limit: Number(limit)
        }
    };
};

const getTicketsByUser = async (userId) => {
    return Ticket.find({ createdBy: userId })
        .populate('assignedTo', 'name email')
        .lean();
};

const getTicketsByAssignee = async (userId) => {
    try {
        // Convert string ID to MongoDB ObjectId
        const objectId = new mongoose.Types.ObjectId(userId);

        return Ticket.find({ assignedTo: objectId })
            .populate('createdBy', 'name email')
            .lean();
    } catch (error) {
        console.error("Error in getTicketsByAssignee:", error.message);
        throw error;
    }
};

const updateTicket = async (ticketId, updates, user) => {
    // Track who made changes
    if (updates.status) {
        updates.statusChangedBy = user.id;
        updates.statusChangedAt = new Date();
    }

    if (updates.assignedTo) {
        updates.assignedBy = user.id;
        updates.assignedAt = new Date();
    }

    return Ticket.findByIdAndUpdate(
        ticketId,
        updates,
        { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
};

const getTicketById = async (ticketId) => {
    return Ticket.findById(ticketId)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean();
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketsByUser,
    getTicketsByAssignee,
    updateTicket,
    getTicketById
};