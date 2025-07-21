const JWT = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

function authToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    JWT.verify(token,JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        req.user = user;
        next();
    });
}

module.exports = authToken;