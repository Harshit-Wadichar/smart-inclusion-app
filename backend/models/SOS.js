const mongoose = require('mongoose');

const SosSchema = new mongoose.Schema({
  userId: { type: String, default: null }, // optional anonymous user id from client
  message: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  status: { type: String, enum: ['open', 'acknowledged', 'closed'], default: 'open' },
  metadata: Object, // accuracy, device info, etc
  createdAt: { type: Date, default: Date.now }
});

SosSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOS', SosSchema);
