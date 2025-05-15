// src/models/procurement.js
const { Schema, model } = require('mongoose');

const ProcurementSchema = new Schema(
    {
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        estimatedCost: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Requested', 'Approved', 'Ordered', 'Received', 'Rejected'],
            default: 'Requested'
        },
        requestedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = model('Procurement', ProcurementSchema);