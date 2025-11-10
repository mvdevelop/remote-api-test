
// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import routes
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Create Express app
const app = express();

// ✅ Configure CORS first (must come before routes)
app.use(
  cors({
    origin: 'http://localhost:5173', // endereço exato do frontend (Vite)
    credentials: true, // necessário para enviar cookies HttpOnly
  })
);

// ✅ Then parse cookies and JSON
app.use(cookieParser());
app.use(express.json());

// ✅ Serve static image files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Root route (status check)
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API running successfully with MongoDB, JWT Auth, and image upload support!',
    uploadsPath: '/uploads/',
  });
});

// ✅ API routes
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);

// ✅ Example protected route (JWT required)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: '🔒 Protected route accessed successfully!',
    user: req.user,
  });
});

// ✅ Handle unknown routes gracefully
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
