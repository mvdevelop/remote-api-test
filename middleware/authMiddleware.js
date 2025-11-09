
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// use o secret específico para o access token
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    // Pega o header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verifica se o token é válido
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Busca o usuário no banco
    const user = await User.findById(payload.id).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Anexa o usuário à requisição
    req.user = user;
    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
