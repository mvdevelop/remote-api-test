
const Data = require('../models/Data');
const path = require('path');

// Get all data
exports.getAllData = async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Create new data entry (with optional image)
exports.createData = async (req, res) => {
  try {
    const { name, value } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newData = new Data({
      name,
      value,
      image: imagePath
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
