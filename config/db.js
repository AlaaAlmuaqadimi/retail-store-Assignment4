const mysql = require('mysql2/promise');

let pool;

function quoteIdentifier(identifier) {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error('DB_NAME must contain only letters, numbers, and underscores.');
  }
  return `\`${identifier}\``;
}

async function initializeDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };
  const database = process.env.DB_NAME || 'retail_store';

  const adminConnection = await mysql.createConnection(config);
  await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(database)}`);
  await adminConnection.end();

  pool = mysql.createPool({
    ...config,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    dateStrings: true
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT PRIMARY KEY AUTO_INCREMENT,
      SupplierName TEXT NOT NULL,
      ContactNumber TEXT NOT NULL
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT PRIMARY KEY AUTO_INCREMENT,
      ProductName TEXT NOT NULL,
      Price DECIMAL(10, 2) NOT NULL,
      StockQuantity INT NOT NULL,
      SupplierID INT NOT NULL,
      CONSTRAINT fk_products_supplier
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
        ON UPDATE CASCADE ON DELETE RESTRICT
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT PRIMARY KEY AUTO_INCREMENT,
      ProductID INT NOT NULL,
      QuantitySold INT NOT NULL,
      SaleDate DATE NOT NULL,
      CONSTRAINT fk_sales_product
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
        ON UPDATE CASCADE ON DELETE RESTRICT
    ) ENGINE=InnoDB
  `);

  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error('Database has not been initialized.');
  }
  return pool;
}

module.exports = { initializeDatabase, getPool };
