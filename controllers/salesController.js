const { getPool } = require('../config/db');

async function recordSale(req, res) {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;
    if (ProductID === undefined || QuantitySold === undefined || !SaleDate) {
      return res.status(400).json({ error: 'ProductID, QuantitySold, and SaleDate are required.' });
    }
    const [result] = await getPool().execute(
      'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
      [ProductID, QuantitySold, SaleDate]
    );
    const [rows] = await getPool().execute('SELECT * FROM Sales WHERE SaleID = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getSales(req, res) {
  try {
    const [rows] = await getPool().query('SELECT * FROM Sales ORDER BY SaleID');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getSalesForProduct(req, res) {
  try {
    const [rows] = await getPool().execute(
      'SELECT * FROM Sales WHERE ProductID = ? ORDER BY SaleDate, SaleID',
      [req.params.productId]
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { recordSale, getSales, getSalesForProduct };
