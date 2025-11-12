const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const ModelEntry = require('../models/ModelEntry');
const { verifyToken } = require('../middleware/auth');

// Get purchases for the authenticated user (models they purchased)
router.get('/my', verifyToken, async (req, res) => {
  try {
    const buys = await Purchase.find({ purchasedBy: req.user.email }).populate('model').sort({ createdAt: -1 });
    res.json(buys);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

module.exports = router;
