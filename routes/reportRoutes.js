const express = require('express');
const controller = require('../controllers/reportController');

const router = express.Router();
router.get('/quantity-sold-per-product', controller.quantitySoldPerProduct);
router.get('/highest-stock-product', controller.highestStockProduct);
router.get('/suppliers-f', controller.suppliersStartingWithF);
router.get('/never-sold-products', controller.neverSoldProducts);
router.get('/sales-full-details', controller.salesFullDetails);

module.exports = router;
