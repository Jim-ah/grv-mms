// src/routes/users.js
const express             = require('express');
const authenticateToken   = require('../middleware/authMiddleware');
const authorizeRoles      = require('../middleware/authorizedRoles');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers, getTechnicians,
} = require('../controllers/userController');

const router = express.Router();

// Allow engineers to get technicians list
router.get('/technicians',
    authenticateToken,
    authorizeRoles('Admin', 'Engineer'),
    getTechnicians);

// Keep existing Admin-only routes below

// ─── Everything below requires:
//      1) a valid JWT (authenticateToken)
//      2) the `Admin` role       (authorizeRoles('Admin'))
router.use(authenticateToken);
router.use(authorizeRoles('Admin'));

// List users        → GET    /api/users
router.get('/', getAllUsers);

// Get one user     → GET    /api/users/:id
router.get('/:id', getUserById);

// Create user      → POST   /api/users
router.post('/', createUser);

// Update user      → PUT    /api/users/:id
router.put('/:id', updateUser);

// Delete one user  → DELETE /api/users/:id
router.delete('/:id', deleteUser);

// Delete all users → DELETE /api/users
router.delete('/', deleteAllUsers);

module.exports = router;
