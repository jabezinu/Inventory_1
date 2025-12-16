const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, enum: ['damage', 'loss', 'expired', 'other'], required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['add', 'remove'], default: 'remove' }, // for future, if adding stock
}, { timestamps: true });

module.exports = mongoose.model('Adjustment', adjustmentSchema);