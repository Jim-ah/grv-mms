// src/models/maintenance.js
const { Schema, model } = require('mongoose');

const TicketSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Canceled', 'Rejected'],
            default: 'Open',
        },
        createdBy: { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },
                deadline: {
                    type: Date
                },
                // Add procurement tracking
                procurementRequired: {
                    type: Boolean,
                    default: false
                }
            },
    { timestamps: true }
);

module.exports = model('Ticket', TicketSchema);