const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const bcrypt = require('bcrypt');

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        next(err);
    }
}

module.exports = { login };
