const express = require('express');
const controller = require('../controllers/productController');

const router = express.Router();
router.post('/', controller.createProduct);
router.get('/', controller.getProducts);
router.post('/schema/add-category', controller.addCategory);
router.post('/schema/remove-category', controller.removeCategory);
router.post('/schema/add-notnull', controller.makeProductNameNotNull);
router.put('/bread/price', controller.updateBreadPrice);
router.delete('/eggs', controller.deleteEggs);
router.get('/:id', controller.getProductById);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
