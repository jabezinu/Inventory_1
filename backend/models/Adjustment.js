const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Adjustment = sequelize.define('Adjustment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  reason: {
    type: DataTypes.ENUM('damage', 'loss', 'expired', 'other'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  type: {
    type: DataTypes.ENUM('add', 'remove'),
    defaultValue: 'remove'
  }
}, {
  timestamps: true,
  tableName: 'adjustments'
});

module.exports = Adjustment;