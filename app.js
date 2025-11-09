
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

// ✅ Configure CORS (allow requests from frontend)
app.use(cors({
  origin: true, // or set to your frontend URL, e.g. "http://localhost:5173"
  credentials: true, // allows cookies if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Parse incoming JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Serve static image files from the uploads folder
// Example: http://localhost:3000/uploads/example.jpg
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// ✅ Root route (API status check)
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API running successfully with MongoDB, JWT Auth, and image upload support!',
    uploadsPath: '/uploads/',
  });
});

// ✅ API routes
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);

// ✅ Protected route example (requires JWT)
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

// Export app (server.js will import this)
module.exports = app;
