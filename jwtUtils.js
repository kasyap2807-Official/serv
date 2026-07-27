const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // use dotenv for real apps

// Generate a JWT token
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access Token Required' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });

    req.user = decoded; // attach payload to request
    next();
  });
}

module.exports = { generateToken, verifyToken };
