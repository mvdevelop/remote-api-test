
// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const ms = require('ms');

// ✅ Variáveis de ambiente
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

// Helpers
const signAccessToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, ACCESS_SECRET, { expiresIn: JWT_EXPIRES_IN });

const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

// ✅ Função auxiliar: define cookie padronizado
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: COOKIE_SECURE, // false para localhost
    sameSite: COOKIE_SECURE ? 'none' : 'lax', // para compatibilidade com HTTPS
    path: '/', // ✅ torna disponível em todas as rotas
    maxAge: ms(REFRESH_EXPIRES_IN),
  });
};

// ✅ POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Logged in successfully',
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ POST /api/auth/refresh
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(403).json({ error: 'No refresh token' });

    let payload;
    try {
      payload = jwt.verify(token, REFRESH_SECRET);
    } catch {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ error: 'Invalid refresh token' });

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshCookie(res, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      expiresIn: JWT_EXPIRES_IN,
      message: 'Token refreshed successfully',
    });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        await User.findByIdAndUpdate(payload.id, { $unset: { refreshToken: 1 } });
      } catch {
        console.warn('Invalid token during logout, ignoring.');
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SECURE ? 'none' : 'lax',
      path: '/',
    });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
