require('dotenv').config();
const mongoose = require('mongoose');
const ModelEntry = require('../models/ModelEntry');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment. Create a server/.env file from .env.example');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  const examples = [
    {
      name: 'BERT',
      framework: 'TensorFlow',
      useCase: 'NLP',
      dataset: 'Wikipedia',
      description: 'A transformer-based model for natural language processing tasks like text classification.',
      image: 'https://ibb.co/sample-image-bert-diagram',
      createdBy: 'user@example.com',
      createdAt: new Date('2025-10-28T11:54:00.000Z'),
      purchased: 10
    },
    {
      name: 'ResNet-50',
      framework: 'PyTorch',
      useCase: 'Computer Vision',
      dataset: 'ImageNet',
      description: 'Residual neural network for image classification tasks.',
      image: 'https://i.imgur.com/sample-resnet.jpg',
      createdBy: 'user@example.com',
      createdAt: new Date(),
      purchased: 4
    }
  ];

  try {
    const inserted = await ModelEntry.insertMany(examples);
    console.log(`Inserted ${inserted.length} example models`);
  } catch (err) {
    console.error('Seeding error', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run().catch(err => { console.error(err); process.exit(1); });
