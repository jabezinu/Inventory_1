const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Customer, as: 'customer' }
      ]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Customer, as: 'customer' }
      ]
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { productId, quantity, sellingPrice } = req.body;
    const prod = await Product.findByPk(productId);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    if (parseFloat(prod.stockQuantity) < parseFloat(quantity)) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update product stock
    prod.stockQuantity = parseFloat(prod.stockQuantity) - parseFloat(quantity);
    await prod.save();

    // Calculate profit
    const profit = (parseFloat(sellingPrice) - parseFloat(prod.averageCost)) * parseFloat(quantity);

    const sale = await Sale.create({ ...req.body, profit });
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    await sale.update(req.body);
    res.json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    await sale.destroy();
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnpaidSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { paid: false },
      include: [
        { model: Product, as: 'product' },
        { model: Customer, as: 'customer' }
      ]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};