const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/database');

exports.getSalesReport = async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly
    let dateFormat;
    if (period === 'daily') dateFormat = 'YYYY-MM-DD';
    else if (period === 'weekly') dateFormat = 'IYYY-IW';
    else if (period === 'monthly') dateFormat = 'YYYY-MM';
    else dateFormat = 'YYYY-MM-DD';

    const report = await Sale.findAll({
      attributes: [
        [fn('TO_CHAR', col('date'), dateFormat), 'period'],
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', literal('"sellingPrice" * quantity')), 'totalRevenue'],
        [fn('SUM', col('profit')), 'totalProfit'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: [fn('TO_CHAR', col('date'), dateFormat)],
      order: [[fn('TO_CHAR', col('date'), dateFormat), 'ASC']],
      raw: true
    });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfitReport = async (req, res) => {
  try {
    const { period } = req.query;
    let dateFormat;
    if (period === 'daily') dateFormat = 'YYYY-MM-DD';
    else if (period === 'weekly') dateFormat = 'IYYY-IW';
    else if (period === 'monthly') dateFormat = 'YYYY-MM';
    else dateFormat = 'YYYY-MM-DD';

    const report = await Sale.findAll({
      attributes: [
        [fn('TO_CHAR', col('date'), dateFormat), 'period'],
        [fn('SUM', col('profit')), 'totalProfit']
      ],
      group: [fn('TO_CHAR', col('date'), dateFormat)],
      order: [[fn('TO_CHAR', col('date'), dateFormat), 'ASC']],
      raw: true
    });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStockReport = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Supplier, as: 'supplier' }
      ]
    });
    const report = products.map(p => ({
      product: p.name,
      stockQuantity: parseFloat(p.stockQuantity),
      averageCost: parseFloat(p.averageCost),
      lowStockThreshold: parseFloat(p.lowStockThreshold),
      isLowStock: parseFloat(p.stockQuantity) <= parseFloat(p.lowStockThreshold)
    }));
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalProfit = async (req, res) => {
  try {
    const result = await Sale.findOne({
      attributes: [[fn('SUM', col('profit')), 'totalProfit']],
      raw: true
    });
    res.json({ totalProfit: parseFloat(result.totalProfit) || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};