const { getPool } = require('../config/db');

async function quantitySoldPerProduct(req, res) {
  try {
    // SUM and GROUP BY calculate the total quantity sold for each product.
    const [rows] = await getPool().query(`
      SELECT p.ProductID, p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
      FROM Products p LEFT JOIN Sales s ON s.ProductID = p.ProductID
      GROUP BY p.ProductID, p.ProductName
      ORDER BY p.ProductID
    `);
    return res.json(rows);
  } catch (error) { return res.status(500).json({ error: error.message }); }
}

async function highestStockProduct(req, res) {
  try {
    // ORDER BY DESC and LIMIT 1 return the product with the greatest stock.
    const [rows] = await getPool().query('SELECT * FROM Products ORDER BY StockQuantity DESC, ProductID LIMIT 1');
    if (!rows.length) return res.status(404).json({ error: 'No products found.' });
    return res.json(rows[0]);
  } catch (error) { return res.status(500).json({ error: error.message }); }
}

async function suppliersStartingWithF(req, res) {
  try {
    // LIKE with the F% pattern selects supplier names beginning with F.
    const [rows] = await getPool().execute('SELECT * FROM Suppliers WHERE SupplierName LIKE ?', ['F%']);
    return res.json(rows);
  } catch (error) { return res.status(500).json({ error: error.message }); }
}

async function neverSoldProducts(req, res) {
  try {
    // LEFT JOIN preserves products without sales; IS NULL filters to those products.
    const [rows] = await getPool().query(`
      SELECT p.* FROM Products p
      LEFT JOIN Sales s ON s.ProductID = p.ProductID
      WHERE s.ProductID IS NULL
      ORDER BY p.ProductID
    `);
    return res.json(rows);
  } catch (error) { return res.status(500).json({ error: error.message }); }
}

async function salesFullDetails(req, res) {
  try {
    // INNER JOIN combines each sale with its product name and requested sale fields.
    const [rows] = await getPool().query(`
      SELECT p.ProductName, s.QuantitySold, s.SaleDate
      FROM Sales s INNER JOIN Products p ON p.ProductID = s.ProductID
      ORDER BY s.SaleDate, s.SaleID
    `);
    return res.json(rows);
  } catch (error) { return res.status(500).json({ error: error.message }); }
}

module.exports = { quantitySoldPerProduct, highestStockProduct, suppliersStartingWithF, neverSoldProducts, salesFullDetails };
