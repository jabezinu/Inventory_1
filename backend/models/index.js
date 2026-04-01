const sequelize = require('../config/database');
const Category = require('./Category');
const Supplier = require('./Supplier');
const Customer = require('./Customer');
const Product = require('./Product');
const Purchase = require('./Purchase');
const Sale = require('./Sale');
const Adjustment = require('./Adjustment');

// Define associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

Purchase.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

Sale.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Sale.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Adjustment.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Reverse associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Supplier.hasMany(Product, { foreignKey: 'supplierId' });
Supplier.hasMany(Purchase, { foreignKey: 'supplierId' });
Customer.hasMany(Sale, { foreignKey: 'customerId' });
Product.hasMany(Purchase, { foreignKey: 'productId' });
Product.hasMany(Sale, { foreignKey: 'productId' });
Product.hasMany(Adjustment, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  Category,
  Supplier,
  Customer,
  Product,
  Purchase,
  Sale,
  Adjustment
};
