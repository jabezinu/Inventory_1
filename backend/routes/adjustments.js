const express = require('express');
const router = express.Router();
const adjustmentsController = require('../controllers/adjustments');

router.get('/', adjustmentsController.getAllAdjustments);
router.get('/:id', adjustmentsController.getAdjustmentById);
router.post('/', adjustmentsController.createAdjustment);
router.put('/:id', adjustmentsController.updateAdjustment);
router.delete('/:id', adjustmentsController.deleteAdjustment);

module.exports = router;