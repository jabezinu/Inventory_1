const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

exports.getAllAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.findAll({
      include: [{ model: Product, as: 'product' }]
    });
    res.json(adjustments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdjustmentById = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id, {
      include: [{ model: Product, as: 'product' }]
    });
    if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
    res.json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAdjustment = async (req, res) => {
  try {
    const { productId, quantity, type } = req.body;
    const prod = await Product.findByPk(productId);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    const adjustQuantity = parseFloat(quantity);
    const currentStock = parseFloat(prod.stockQuantity);

    if (type === 'remove') {
      if (currentStock < adjustQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      prod.stockQuantity = currentStock - adjustQuantity;
    } else if (type === 'add') {
      prod.stockQuantity = currentStock + adjustQuantity;
    }
    await prod.save();

    const adjustment = await Adjustment.create(req.body);
    res.status(201).json(adjustment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id);
    if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
    await adjustment.update(req.body);
    res.json(adjustment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id);
    if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
    await adjustment.destroy();
    res.json({ message: 'Adjustment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};