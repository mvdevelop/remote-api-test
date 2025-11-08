
const express = require('express');
const cors = require('cors');
const path = require('path');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({ message: '🚀 API running successfully with image upload support!' });
});

// Routes
app.use('/api/data', dataRoutes);

module.exports = app;
