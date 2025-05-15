// src/services/commentService.js
const Comment = require('../models/comment');

const createComment = async (ticketId, userId, content, isInternal = false) => {
    const comment = new Comment({
        ticketId,
        content,
        createdBy: userId,
        isInternal
    });
    await comment.save();
    return comment.populate('createdBy', 'name email role');
};

const getCommentsByTicket = async (ticketId, userRole) => {
    // If client, only return non-internal comments
    const query = { ticketId };
    if (userRole === 'Client') {
        query.isInternal = false;
    }

    return Comment.find(query)
        .populate('createdBy', 'name email role')
        .sort({ createdAt: 1 })
        .lean();
};

module.exports = {
    createComment,
    getCommentsByTicket
};