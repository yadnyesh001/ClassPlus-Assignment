require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Template = require('../models/Template');

const SEED = [
  {
    title: 'Birthday Burst',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200',
    isPremium: false,
  },
  {
    title: 'Cake & Candles',
    category: 'Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200',
    isPremium: true,
  },
  {
    title: 'Anniversary Roses',
    category: 'Anniversary',
    imageUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1200',
    isPremium: false,
  },
  {
    title: 'Forever Hearts',
    category: 'Anniversary',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200',
    isPremium: true,
  },
  {
    title: 'Festival Lights',
    category: 'Festival',
    imageUrl: 'https://images.unsplash.com/photo-1573676048035-9c2a72b6a12a?w=1200',
    isPremium: false,
  },
  {
    title: 'Diwali Glow',
    category: 'Festival',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200',
    isPremium: false,
  },
  {
    title: 'Congrats Confetti',
    category: 'Congratulations',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
    isPremium: false,
  },
  {
    title: 'Graduation Gold',
    category: 'Congratulations',
    imageUrl: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200',
    isPremium: true,
  },
];

(async () => {
  try {
    await connectDB();
    await Template.deleteMany({});
    await Template.insertMany(SEED);
    console.log(`Seeded ${SEED.length} templates`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
