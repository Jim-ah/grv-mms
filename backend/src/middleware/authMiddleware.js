const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // header format: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {return res.status(403).json({ message: 'Invalid token' })
        }
        req.user = payload; // { id: "...", role: "...", iat: ..., exp: ... }
        next();
    });
}

module.exports = authenticateToken;
