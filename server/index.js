require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const modelsRoute = require('./routes/models');
const publicRoute = require('./routes/public');
const purchasesRoute = require('./routes/purchases');
const events = require('./events');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set; starting server without database connection (API calls may fail)');
} else {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error', err.message);
      // Keep server running for non-DB endpoints
    });
}

app.use('/api/models', modelsRoute);
app.use('/api/public', publicRoute);
app.use('/api/purchases', purchasesRoute);

// SSE endpoint for model events (purchases)
app.get('/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  const onPurchase = (payload) => {
    res.write(`event: purchase\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
  events.on('purchase', onPurchase);
  req.on('close', () => {
    events.removeListener('purchase', onPurchase);
  });
});

app.get('/', (req, res) => res.json({ ok: true, message: 'Model Inventory API' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
