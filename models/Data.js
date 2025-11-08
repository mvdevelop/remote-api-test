
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String },
    image: { type: String } // stores the image file path
  },
  { timestamps: true }
);

module.exports = mongoose.model('Data', dataSchema);
