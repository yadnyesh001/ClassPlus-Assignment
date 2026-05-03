const Template = require('../models/Template');

exports.list = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const templates = await Template.find(filter).sort({ createdAt: -1 });
  res.json(templates);
};

exports.categories = async (_req, res) => {
  const cats = await Template.distinct('category');
  res.json(cats);
};

exports.getOne = async (req, res) => {
  const tpl = await Template.findById(req.params.id);
  if (!tpl) return res.status(404).json({ message: 'Template not found' });
  res.json(tpl);
};
