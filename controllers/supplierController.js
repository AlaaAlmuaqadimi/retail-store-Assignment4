const { getPool } = require('../config/db');

async function createSupplier(req, res) {
  try {
    const { SupplierName, ContactNumber } = req.body;
    if (!SupplierName || !ContactNumber) return res.status(400).json({ error: 'SupplierName and ContactNumber are required.' });
    const [result] = await getPool().execute(
      'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
      [SupplierName, ContactNumber]
    );
    const [rows] = await getPool().execute('SELECT * FROM Suppliers WHERE SupplierID = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getSuppliers(req, res) {
  try {
    const [rows] = await getPool().query('SELECT * FROM Suppliers ORDER BY SupplierID');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function updateSupplier(req, res) {
  try {
    const { SupplierName, ContactNumber } = req.body;
    if (!SupplierName || !ContactNumber) return res.status(400).json({ error: 'SupplierName and ContactNumber are required.' });
    const [result] = await getPool().execute(
      'UPDATE Suppliers SET SupplierName = ?, ContactNumber = ? WHERE SupplierID = ?',
      [SupplierName, ContactNumber, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Supplier not found.' });
    const [rows] = await getPool().execute('SELECT * FROM Suppliers WHERE SupplierID = ?', [req.params.id]);
    return res.json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteSupplier(req, res) {
  try {
    const [result] = await getPool().execute('DELETE FROM Suppliers WHERE SupplierID = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Supplier not found.' });
    return res.json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function alterContactNumber(req, res) {
  try {
    await getPool().query('ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)');
    return res.json({ message: 'ContactNumber changed to VARCHAR(15).' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier, alterContactNumber };
