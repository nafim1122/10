const mongoose = require('mongoose');

const ModelEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  framework: { type: String, required: true },
  useCase: { type: String, required: true },
  dataset: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // ImgBB or other hosted image URL
  createdBy: { type: String, required: true }, // email of the creator
  createdAt: { type: Date, default: Date.now },
  purchased: { type: Number, default: 0 },
  ratings: [{ by: String, rating: Number, createdAt: { type: Date, default: Date.now } }],
  ratingsCount: { type: Number, default: 0 },
  ratingsTotal: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('ModelEntry', ModelEntrySchema);
