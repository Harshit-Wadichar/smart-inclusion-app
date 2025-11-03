const Place = require('../models/Place');

exports.createPlace = async (req, res, next) => {
  try {
    const { name, description, address, lat, lng, tags = '' } = req.body;
    if (!name || !lat || !lng) return res.status(400).json({ msg: 'name, lat, lng required' });

    const place = new Place({
      name,
      description,
      address,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    await place.save();
    res.status(201).json(place);
  } catch (err) {
    next(err);
  }
};

exports.getNearby = async (req, res, next) => {
  try {
    const { lng, lat, radius = 3000, tags } = req.query;
    if (!lng || !lat) return res.status(400).json({ msg: 'lng and lat required' });

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      }
    };

    if (tags) query.tags = { $in: tags.split(',').map(t => t.trim()) };

    const places = await Place.find(query).limit(200);
    res.json(places);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const places = await Place.find({}).sort({ createdAt: -1 }).limit(1000);
    res.json(places);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ msg: 'Not found' });
    res.json(place);
  } catch (err) {
    next(err);
  }
};

exports.deletePlace = async (req, res, next) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
