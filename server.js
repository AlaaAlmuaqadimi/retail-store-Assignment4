require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const salesRoutes = require('./routes/salesRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { seedData } = require('./controllers/productController');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportRoutes);
app.post('/api/seed', seedData);

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

const port = Number(process.env.PORT || 3000);

async function start() {
  try {
    await initializeDatabase();
    app.listen(port, () => console.log(`Retail Store API listening on port ${port}`));
  } catch (error) {
    console.error('Failed to initialize the database:', error.message);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
