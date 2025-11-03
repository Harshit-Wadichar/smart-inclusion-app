const Volunteer = require('../models/Volunteer');

// Create a new volunteer
exports.createVolunteer = async (req, res, next) => {
  try {
    // Destructure fields from request body
    const { name, phone, email, city, skills, verified, location, lat, lng } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Build location object
    let locationObj = location;
    if (!locationObj && lat && lng) {
      locationObj = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    }

    // Create new volunteer
    const volunteer = new Volunteer({
      name,
      phone,
      email,
      city,
      skills: Array.isArray(skills) ? skills : [], // ensure skills is an array
      verified: verified || false,                 // default to false if not provided
      location: locationObj
    });

    const savedVolunteer = await volunteer.save();
    res.status(201).json(savedVolunteer);
  } catch (err) {
    next(err);
  }
};

// Get all volunteers
exports.getAll = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find({}).limit(500);
    res.json(volunteers);
  } catch (err) {
    next(err);
  }
};

// Get volunteers nearby a location
exports.getNearby = async (req, res, next) => {
  try {
    const { lng, lat, radius = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ msg: 'lng & lat required' });
    }

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
