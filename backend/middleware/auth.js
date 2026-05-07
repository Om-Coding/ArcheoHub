const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const authorizeArchaeologist = (req, res, next) => {
  if (req.user.role !== 'archaeologist') {
    return res.status(403).json({ error: 'Access denied. Archaeologist role required.' });
  }
  next();
};

module.exports = { authenticate, authorizeArchaeologist };
