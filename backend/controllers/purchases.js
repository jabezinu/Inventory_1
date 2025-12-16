const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('product supplier');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('product supplier');
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const { product, quantity, costPrice } = req.body;
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    // Update product stock and average cost
    const newTotalCost = (prod.averageCost * prod.stockQuantity) + (costPrice * quantity);
    const newTotalQuantity = prod.stockQuantity + quantity;
    prod.averageCost = newTotalCost / newTotalQuantity;
    prod.stockQuantity = newTotalQuantity;
    await prod.save();

    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    // Optionally, reverse the stock update, but for simplicity, not doing it here
    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};