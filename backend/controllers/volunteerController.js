const Volunteer = require('../models/Volunteer');

exports.createVolunteer = async (req, res, next) => {
  try {
    const { name, email, phone, city, skills = '', lat, lng } = req.body;

    const volunteer = new Volunteer({
      name,
      email,
      phone,
      city,
      skills: skills ? skills.split(',').map(s => s.trim()) : []
    });

    if (lat && lng) {
      volunteer.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    }

    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find({}).limit(500);
    res.json(volunteers);
  } catch (err) {
    next(err);
  }
};

exports.getNearby = async (req, res, next) => {
  try {
    const { lng, lat, radius = 5000 } = req.query;
    if (!lng || !lat) return res.status(400).json({ msg: 'lng & lat required' });

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      }
    };

    const volunteers = await Volunteer.find(query).limit(100);
    res.json(volunteers);
  } catch (err) {
    next(err);
  }
};
