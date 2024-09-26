const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require('../config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, JWT_ADMIN_SECRET);
    if (decodedToken) {
        req.userId = decodedToken.id;
        next();
    } else {
        return res.status(403).json({
            message: "You are not signed in"
        })
    }
}

module.exports = {
    adminMiddleware
}