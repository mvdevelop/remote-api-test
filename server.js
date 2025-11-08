
require('dotenv').config();
const app = require('./app');
const connectDB = require('./database');

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
