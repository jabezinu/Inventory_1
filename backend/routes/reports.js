const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');

router.get('/sales', reportsController.getSalesReport);
router.get('/profit', reportsController.getProfitReport);
router.get('/stock', reportsController.getStockReport);
router.get('/total-profit', reportsController.getTotalProfit);

module.exports = router;