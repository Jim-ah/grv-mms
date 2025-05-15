// src/services/procurementService.js
const Procurement = require('../models/procurement');

const createProcurementItem = async (data) => {
    const procurement = new Procurement(data);
    await procurement.save();
    return procurement.populate([
        { path: 'requestedBy', select: 'name email role' },
        { path: 'approvedBy', select: 'name email role' }
    ]);
};

const getProcurementsByTicket = async (ticketId) => {
    return Procurement.find({ ticketId })
        .populate('requestedBy', 'name email role')
        .populate('approvedBy', 'name email role')
        .sort({ createdAt: -1 })
        .lean();
};

const updateProcurementStatus = async (itemId, status, userId) => {
    const updates = { status };

    // If approving, record who approved it
    if (status === 'Approved') {
        updates.approvedBy = userId;
    }

    return Procurement.findByIdAndUpdate(
        itemId,
        updates,
        { new: true, runValidators: true }
    ).populate([
        { path: 'requestedBy', select: 'name email role' },
        { path: 'approvedBy', select: 'name email role' }
    ]);
};

const getAllProcurements = async (filters = {}) => {
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }

    return Procurement.find(query)
        .populate('ticketId', 'title status')
        .populate('requestedBy', 'name email role')
        .populate('approvedBy', 'name email role')
        .sort({ createdAt: -1 })
        .lean();
};

module.exports = {
    createProcurementItem,
    getProcurementsByTicket,
    updateProcurementStatus,
    getAllProcurements
};