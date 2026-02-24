const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Handle both userId and user.id from token payload
    req.user = decoded.userId ? { id: decoded.userId } : (decoded.user || {});
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

