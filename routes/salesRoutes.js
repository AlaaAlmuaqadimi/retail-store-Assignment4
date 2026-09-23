const express = require('express');
const controller = require('../controllers/salesController');

const router = express.Router();
router.post('/', controller.recordSale);
router.get('/', controller.getSales);
router.get('/product/:productId', controller.getSalesForProduct);

module.exports = router;
