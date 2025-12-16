const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: { type: String },
  address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);