const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('product customer');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('product customer');
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { product, quantity, sellingPrice } = req.body;
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    if (prod.stockQuantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    // Update product stock
    prod.stockQuantity -= quantity;
    await prod.save();

    // Calculate profit
    const profit = (sellingPrice - prod.averageCost) * quantity;

    const sale = new Sale({ ...req.body, profit });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    // Optionally, add back stock, but for simplicity, not doing it
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnpaidSales = async (req, res) => {
  try {
    const sales = await Sale.find({ paid: false }).populate('product customer');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};