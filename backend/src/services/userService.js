const bcrypt = require('bcrypt');
const User = require('../models/users');

const SALT_ROUNDS = 10;

async function findAll() {
    return User.find().lean();
}

async function findById(id) {
    return User.findById(id).lean();
}

async function create(data) {
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = new User({
        name: data.name,
        email: data.email,
        role: data.role || 'Client',
        passwordHash,
    });
    return user.save();
}

async function findByEmail(email) {
    return User.findOne({ email }).lean();
}

async function update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true }).lean();
}

async function deleteUser(id) {
    await User.findByIdAndDelete(id);
}

async function deleteAllUsers() {
    await User.deleteMany({});
}

async function findByRole(role) {
    return User.find({ role }).select('name email _id').lean();
}

module.exports = {
    findAll,
    findById,
    create,
    findByEmail,
    update,
    deleteUser,
    deleteAllUsers,
    findByRole

};
