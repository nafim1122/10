const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'ModelEntry', required: true },
  purchasedBy: { type: String, required: true }, // buyer email
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
