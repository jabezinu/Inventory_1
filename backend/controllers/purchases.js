const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' }
      ]
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' }
      ]
    });
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const { productId, quantity, costPrice } = req.body;
    const prod = await Product.findByPk(productId);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    // Update product stock and average cost
    const currentStock = parseFloat(prod.stockQuantity);
    const currentAvgCost = parseFloat(prod.averageCost);
    const newQuantity = parseFloat(quantity);
    const newCostPrice = parseFloat(costPrice);
    
    const newTotalCost = (currentAvgCost * currentStock) + (newCostPrice * newQuantity);
    const newTotalQuantity = currentStock + newQuantity;
    prod.averageCost = newTotalCost / newTotalQuantity;
    prod.stockQuantity = newTotalQuantity;
    await prod.save();

    const purchase = await Purchase.create(req.body);
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    await purchase.update(req.body);
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    await purchase.destroy();
    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};