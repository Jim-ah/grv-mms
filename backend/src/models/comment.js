// src/models/comment.js
const { Schema, model } = require('mongoose');

const CommentSchema = new Schema(
    {
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isInternal: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = model('Comment', CommentSchema);