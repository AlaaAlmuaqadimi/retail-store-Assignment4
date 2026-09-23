-- Run this script as a MySQL administrator.
-- Replace retail_store with the database name if DB_NAME is different.

-- Create the application user.
CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'a_password';

-- Grant the required permissions on every table in the retail_store database.
GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost';

-- Remove UPDATE after the initial grant, as required by the assignment.
REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';

-- Allow DELETE only on the Sales table.
GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost';

-- Reload privilege tables.
FLUSH PRIVILEGES;
