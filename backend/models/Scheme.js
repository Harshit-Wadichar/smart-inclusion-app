const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  organization: String,
  url: String,
  startDate: Date,
  endDate: Date,
  location: String, // optional textual location
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', SchemeSchema);
