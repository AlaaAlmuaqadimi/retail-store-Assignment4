const { getPool } = require('../config/db');

function requireFields(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null);
}

async function createProduct(req, res) {
  try {
    const missing = requireFields(req.body, ['ProductName', 'Price', 'StockQuantity', 'SupplierID']);
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });

    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const [result] = await getPool().execute(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      [ProductName, Price, StockQuantity, SupplierID]
    );
    const [rows] = await getPool().execute('SELECT * FROM Products WHERE ProductID = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const [rows] = await getPool().query(`
      SELECT p.*, s.SupplierName
      FROM Products p JOIN Suppliers s ON s.SupplierID = p.SupplierID
      ORDER BY p.ProductID
    `);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const [rows] = await getPool().execute(
      `SELECT p.*, s.SupplierName FROM Products p
       JOIN Suppliers s ON s.SupplierID = p.SupplierID WHERE p.ProductID = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found.' });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const missing = requireFields(req.body, ['ProductName', 'Price', 'StockQuantity', 'SupplierID']);
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const [result] = await getPool().execute(
      `UPDATE Products SET ProductName = ?, Price = ?, StockQuantity = ?, SupplierID = ?
       WHERE ProductID = ?`,
      [ProductName, Price, StockQuantity, SupplierID, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Product not found.' });
    const [rows] = await getPool().execute('SELECT * FROM Products WHERE ProductID = ?', [req.params.id]);
    return res.json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const [result] = await getPool().execute('DELETE FROM Products WHERE ProductID = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Product not found.' });
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function addCategory(req, res) {
  try {
    await getPool().query('ALTER TABLE Products ADD COLUMN Category VARCHAR(100)');
    return res.json({ message: 'Category column added.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function removeCategory(req, res) {
  try {
    await getPool().query('ALTER TABLE Products DROP COLUMN Category');
    return res.json({ message: 'Category column removed.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function makeProductNameNotNull(req, res) {
  try {
    await getPool().query('ALTER TABLE Products MODIFY ProductName TEXT NOT NULL');
    return res.json({ message: 'ProductName is now NOT NULL.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function seedData(req, res) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [supplier] = await connection.execute(
      'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
      ['FreshFoods', '01001234567']
    );
    const supplierId = supplier.insertId;
    const products = [
      ['Milk', 15.00, 50],
      ['Bread', 10.00, 30],
      ['Eggs', 20.00, 40]
    ];
    const productIds = {};
    for (const [name, price, stock] of products) {
      const [product] = await connection.execute(
        'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
        [name, price, stock, supplierId]
      );
      productIds[name] = product.insertId;
    }
    await connection.execute(
      'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
      [productIds.Milk, 2, '2025-05-20']
    );
    await connection.commit();
    return res.status(201).json({ message: 'Seed data inserted.', supplierId, productIds });
  } catch (error) {
    await connection.rollback();
    return res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
}

async function updateBreadPrice(req, res) {
  try {
    const [result] = await getPool().execute(
      'UPDATE Products SET Price = ? WHERE ProductName = ?',
      [25.00, 'Bread']
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Bread not found.' });
    return res.json({ message: 'Bread price updated to 25.00.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteEggs(req, res) {
  try {
    const [result] = await getPool().execute('DELETE FROM Products WHERE ProductName = ?', ['Eggs']);
    if (!result.affectedRows) return res.status(404).json({ error: 'Eggs not found.' });
    return res.json({ message: 'Eggs deleted.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct,
  addCategory, removeCategory, makeProductNameNotNull, seedData,
  updateBreadPrice, deleteEggs
};
