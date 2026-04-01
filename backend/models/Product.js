const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'suppliers',
      key: 'id'
    }
  },
  stockQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  averageCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  lowStockThreshold: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 10
  }
}, {
  timestamps: true,
  tableName: 'products'
});

module.exports = Product;