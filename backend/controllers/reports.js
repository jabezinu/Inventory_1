const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.getSalesReport = async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly
    let groupBy;
    if (period === 'daily') groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
    else if (period === 'weekly') groupBy = { $dateToString: { format: '%Y-%U', date: '$date' } };
    else if (period === 'monthly') groupBy = { $dateToString: { format: '%Y-%m', date: '$date' } };
    else groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };

    const report = await Sale.aggregate([
      {
        $group: {
          _id: groupBy,
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$sellingPrice', '$quantity'] } },
          totalProfit: { $sum: '$profit' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfitReport = async (req, res) => {
  try {
    const { period } = req.query;
    let groupBy;
    if (period === 'daily') groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
    else if (period === 'weekly') groupBy = { $dateToString: { format: '%Y-%U', date: '$date' } };
    else if (period === 'monthly') groupBy = { $dateToString: { format: '%Y-%m', date: '$date' } };
    else groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };

    const report = await Sale.aggregate([
      {
        $group: {
          _id: groupBy,
          totalProfit: { $sum: '$profit' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStockReport = async (req, res) => {
  try {
    const products = await Product.find().populate('category supplier');
    const report = products.map(p => ({
      product: p.name,
      stockQuantity: p.stockQuantity,
      averageCost: p.averageCost,
      lowStockThreshold: p.lowStockThreshold,
      isLowStock: p.stockQuantity <= p.lowStockThreshold
    }));
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalProfit = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$profit' }
        }
      }
    ]);
    res.json({ totalProfit: result[0]?.totalProfit || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};