 module.exports = function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        console.log("USER", req.user)
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
