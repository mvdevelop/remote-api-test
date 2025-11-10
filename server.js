
require('dotenv').config();
const app = require('./app');
const connectDB = require('./database');

// Conecta ao MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Inicia o servidor
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
