
// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const dataRoutes = require('./routes/dataRoutes');

// Create Express app
const app = express();

// ✅ Configure CORS (allow requests from frontend)
app.use(cors({
  origin: '*', // You can restrict to your frontend URL if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Parse incoming JSON requests
app.use(express.json());

// ✅ Serve static image files from the uploads folder
//    Example: http://localhost:3000/uploads/example.jpg
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// ✅ Root route (API status check)
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API running successfully with MongoDB and image upload support!',
    uploadsPath: '/uploads/',
  });
});

// ✅ API routes
app.use('/api/data', dataRoutes);

// ✅ Handle unknown routes gracefully
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export app (server.js will import this)
module.exports = app;
