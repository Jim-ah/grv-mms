const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['Admin', 'Client', 'Engineer', 'Technician'],
        },
    },
    { timestamps: true }
);

module.exports = model('User', UserSchema);
