const userService = require('../services/userService');

async function getAllUsers(req, res, next) {
    try {
        const users = await userService.findAll();
        res.json(users);
    } catch (err) {
        next(err);
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
}

async function createUser(req, res, next) {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await userService.create({ name, email, password, role });
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const updated = await userService.update(req.params.id, req.body);
        if (!updated) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
}

async function deleteUser(req, res, next) {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
}

async function deleteAllUsers(req, res, next) {
    try {
        await userService.deleteAllUsers();
        res.json({ message: 'All users deleted successfully' });
    } catch (err) {
        next(err);
    }
}
async function getTechnicians(req, res, next) {
    try {
        const technicians = await userService.findByRole('Technician');
        res.json(technicians);
    } catch (err) {
        next(err);
    }
}



module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    getTechnicians
};
