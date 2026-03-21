const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
   const authHeader = req.header('Authorization');

  // Get token from header
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Handle both userId and user.id from token payload
    req.user = decoded.userId ? { id: decoded.userId } : (decoded.user || {});
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

