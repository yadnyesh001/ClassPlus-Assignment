const mongoose = require('mongoose');

const overlaySchema = new mongoose.Schema(
  {
    name: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.12 },
      fontSize: { type: Number, default: 0.06 },
      color: { type: String, default: '#ffffff' },
      align: { type: String, default: 'center' },
    },
    profile: {
      x: { type: Number, default: 0.12 },
      y: { type: Number, default: 0.12 },
      radius: { type: Number, default: 0.08 },
    },
    wishes: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.85 },
      fontSize: { type: Number, default: 0.035 },
      color: { type: String, default: '#ffffff' },
      align: { type: String, default: 'center' },
      maxWidth: { type: Number, default: 0.8 },
    },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true, index: true },
    isPremium: { type: Boolean, default: false },
    overlayConfig: { type: overlaySchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
