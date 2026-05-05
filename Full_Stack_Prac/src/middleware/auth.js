const jwt = require('jsonwebtoken');
const { findUserById } = require('../modals/User');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'banking-access-secret';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired access token.' });
    }

    const user = findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = { userId: user.id, role: user.role, email: user.email };
    next();
  });
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
