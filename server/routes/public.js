const express = require('express');
const router = express.Router();
const ModelEntry = require('../models/ModelEntry');

// Public endpoint: list all models (no auth). Returns limited fields.
router.get('/models', async (req, res) => {
  try {
    const { framework, q } = req.query;
    const filter = {};
    if (framework && framework !== 'All') filter.framework = framework;
    if (q) filter.name = { $regex: q, $options: 'i' };
  const items = await ModelEntry.find(filter, { name: 1, framework: 1, useCase: 1, dataset: 1, description: 1, image: 1, purchased: 1, averageRating:1, ratingsCount:1, createdAt: 1 }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Failed to fetch public models', err.message);
    res.status(500).json({ error: 'Failed to fetch public models' });
  }
});

// Return distinct frameworks for filtering
router.get('/frameworks', async (req, res) => {
  try {
    const frameworks = await ModelEntry.distinct('framework');
    // filter out falsy and sort
    const list = frameworks.filter(Boolean).sort();
    res.json(list);
  } catch (err) {
    console.error('Failed to fetch frameworks', err.message);
    res.status(500).json({ error: 'Failed to fetch frameworks' });
  }
});

module.exports = router;
