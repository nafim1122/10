const express = require('express');
const router = express.Router();
const ModelEntry = require('../models/ModelEntry');
const { verifyToken } = require('../middleware/auth');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

// Get all models for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await ModelEntry.find({ createdBy: req.user.email }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, framework, useCase, dataset, description, image } = req.body;
    if (!name || !framework || !useCase || !dataset || !description || !image) return res.status(400).json({ error: 'Missing fields' });
    const entry = new ModelEntry({ name, framework, useCase, dataset, description, image, createdBy: req.user.email });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create model entry' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await ModelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    // increment purchased (view count) for each view by authenticated users
    entry.purchased = (entry.purchased || 0) + 1;
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

// Purchase a model: create a Purchase record and increment purchased counter atomically
router.post('/:id/purchase', verifyToken, async (req, res) => {
  try {
    const entry = await ModelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    const purchase = new Purchase({ model: entry._id, purchasedBy: req.user.email });
    await purchase.save();
    // atomic increment using $inc and return the updated document
    const updated = await ModelEntry.findByIdAndUpdate(entry._id, { $inc: { purchased: 1 } }, { new: true });
    // emit event for real-time clients
    try { const events = require('../events'); events.emit('purchase', { id: updated._id.toString(), purchased: updated.purchased }); } catch (e) { }
    res.json({ success: true, purchased: updated.purchased });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await ModelEntry.findById(req.params.id);
    if (!entry || entry.createdBy !== req.user.email) return res.status(404).json({ error: 'Not found' });
    const { name, framework, useCase, dataset, description, image } = req.body;
    entry.name = name || entry.name;
    entry.framework = framework || entry.framework;
    entry.useCase = useCase || entry.useCase;
    entry.description = typeof description === 'string' ? description : entry.description;
    entry.dataset = dataset || entry.dataset;
    entry.image = image || entry.image;
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update model' });
  }
});

// Rate a model (1-5 stars)
router.post('/:id/rate', verifyToken, async (req, res) => {
  try {
    const { rating } = req.body;
    const num = Number(rating);
    if (!num || num < 1 || num > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
    const id = req.params.id;
    // push rating and increment counters
    const updated = await ModelEntry.findByIdAndUpdate(id, {
      $push: { ratings: { by: req.user.email, rating: num } },
      $inc: { ratingsCount: 1, ratingsTotal: num }
    }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    // compute average
    const avg = updated.ratingsCount ? (updated.ratingsTotal / updated.ratingsCount) : 0;
    updated.averageRating = avg;
    await updated.save();
    res.json({ success: true, averageRating: avg, ratingsCount: updated.ratingsCount });
  } catch (err) {
    console.error('Failed to rate model', err);
    res.status(500).json({ error: 'Failed to rate model' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await ModelEntry.findById(req.params.id);
    if (!entry || entry.createdBy !== req.user.email) return res.status(404).json({ error: 'Not found' });
    await entry.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

module.exports = router;
