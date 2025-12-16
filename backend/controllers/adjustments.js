const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

exports.getAllAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.find().populate('product');
    res.json(adjustments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdjustmentById = async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id).populate('product');
    if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
    res.json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAdjustment = async (req, res) => {
  try {
    const { product, quantity, type } = req.body;
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    if (type === 'remove') {
      if (prod.stockQuantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });
      prod.stockQuantity -= quantity;
    } else if (type === 'add') {
      prod.stockQuantity += quantity;
    }
    await prod.save();

    const adjustment = new Adjustment(req.body);
    await adjustment.save();
    res.status(201).json(adjustment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
    res.json(adjustment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByIdAndDelete(req.params.id);
    if (!adjustment) return res.status(404).json({ error: 'Adjustment not found' });
    res.json({ message: 'Adjustment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};