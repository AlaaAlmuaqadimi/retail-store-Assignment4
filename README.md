# Retail Store API

A complete RESTful API for managing suppliers, products, and sales with **Node.js**, **Express.js**, and **MySQL** using `mysql2/promise`.

## Requirements

- Node.js 18 or newer
- MySQL 8 or newer
- A MySQL user allowed to create databases and tables

## Setup

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with the MySQL connection values. The application creates `DB_NAME` automatically if it does not exist.

3. Install dependencies and start the server:

   ```bash
   npm install
   npm start
   ```

The API listens on `http://localhost:3000` by default. Use `npm run dev` for nodemon during development.

## Database

At startup, the application creates these InnoDB tables if they do not exist:

- `Suppliers(SupplierID, SupplierName, ContactNumber)`
- `Products(ProductID, ProductName, Price, StockQuantity, SupplierID)`
- `Sales(SaleID, ProductID, QuantitySold, SaleDate)`

Foreign keys connect products to suppliers and sales to products. All user-provided SQL values are sent through parameterized placeholders.

## Endpoints

All request and response bodies use JSON.

### Products

| Method | Endpoint | Purpose | Example body |
|---|---|---|---|
| POST | `/api/products` | Create a product | `{ "ProductName": "Milk", "Price": 15, "StockQuantity": 50, "SupplierID": 1 }` |
| GET | `/api/products` | Retrieve all products | — |
| GET | `/api/products/:id` | Retrieve one product | — |
| PUT | `/api/products/:id` | Replace product information | `{ "ProductName": "Milk", "Price": 16, "StockQuantity": 48, "SupplierID": 1 }` |
| DELETE | `/api/products/:id` | Delete a product | — |
| POST | `/api/products/schema/add-category` | Add `Category VARCHAR(100)` | — |
| POST | `/api/products/schema/remove-category` | Remove `Category` | — |
| POST | `/api/products/schema/add-notnull` | Make `ProductName` `NOT NULL` | — |
| PUT | `/api/products/bread/price` | Set Bread price to 25.00 | — |
| DELETE | `/api/products/eggs` | Delete Eggs | — |

Example product response:

```json
{
  "ProductID": 1,
  "ProductName": "Milk",
  "Price": "15.00",
  "StockQuantity": 50,
  "SupplierID": 1
}
```

### Suppliers

| Method | Endpoint | Purpose | Example body |
|---|---|---|---|
| POST | `/api/suppliers` | Create a supplier | `{ "SupplierName": "FreshFoods", "ContactNumber": "01001234567" }` |
| GET | `/api/suppliers` | Retrieve all suppliers | — |
| PUT | `/api/suppliers/:id` | Update supplier information | `{ "SupplierName": "FreshFoods", "ContactNumber": "01001234567" }` |
| DELETE | `/api/suppliers/:id` | Delete a supplier | — |
| POST | `/api/suppliers/schema/alter-contact` | Change `ContactNumber` to `VARCHAR(15)` | — |

### Sales

| Method | Endpoint | Purpose | Example body |
|---|---|---|---|
| POST | `/api/sales` | Record a sale | `{ "ProductID": 1, "QuantitySold": 2, "SaleDate": "2025-05-20" }` |
| GET | `/api/sales` | Retrieve all sales | — |
| GET | `/api/sales/product/:productId` | Retrieve sales for one product | — |

### Seed data

`POST /api/seed` inserts the assignment data in a transaction:

- Supplier `FreshFoods`, contact `01001234567`
- Milk at 15.00 with stock 50
- Bread at 10.00 with stock 30
- Eggs at 20.00 with stock 40
- A sale of 2 Milk units on `2025-05-20`

The endpoint uses each actual generated insert ID for the foreign-key relationships. Running it more than once intentionally creates another seed set.

### Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/quantity-sold-per-product` | Total quantity sold per product using `SUM` and `GROUP BY` |
| GET | `/api/reports/highest-stock-product` | Product with the highest stock using `ORDER BY ... DESC LIMIT 1` |
| GET | `/api/reports/suppliers-f` | Suppliers whose names begin with `F` |
| GET | `/api/reports/never-sold-products` | Products with no matching sales using `LEFT JOIN` and `IS NULL` |
| GET | `/api/reports/sales-full-details` | Product name, quantity sold, and sale date using an `INNER JOIN` |

### Health check

`GET /health` returns `{ "status": "ok" }` after the Express process is running.

## Administrative permissions

Run `scripts/userPrivileges.sql` as a MySQL administrator after changing the database name if needed. It creates `store_manager`, grants `SELECT`, `INSERT`, and `UPDATE` on the database, revokes `UPDATE`, and grants `DELETE` only on `Sales`.

## Bonus

`bonus.txt` contains the SQL solution for LeetCode's **Customer Who Visited but Did Not Make Any Transactions** problem.
