const express = require('express');
const controller = require('../controllers/supplierController');

const router = express.Router();
router.post('/', controller.createSupplier);
router.get('/', controller.getSuppliers);
router.put('/:id', controller.updateSupplier);
router.delete('/:id', controller.deleteSupplier);
router.post('/schema/alter-contact', controller.alterContactNumber);

module.exports = router;
