const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales');

router.get('/', salesController.getAllSales);
router.get('/unpaid', salesController.getUnpaidSales);
router.get('/:id', salesController.getSaleById);
router.post('/', salesController.createSale);
router.put('/:id', salesController.updateSale);
router.delete('/:id', salesController.deleteSale);

module.exports = router;