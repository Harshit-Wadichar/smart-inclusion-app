const Volunteer = require('../models/Volunteer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new volunteer (user)
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, lat, lng, location } = req.body;

    console.log("Received body:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    const existing = await Volunteer.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'Volunteer already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // handle location (from lat/lng or from frontend)
    let locationObj = location;
    if (!locationObj && lat && lng) {
      locationObj = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    const volunteer = new Volunteer({
      name,
      email,
      phone,
      passwordHash,
      location: locationObj,
    });

    await volunteer.save();

    const token = jwt.sign(
      { id: volunteer._id, email: volunteer.email, role: 'volunteer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      ok: true,
      msg: 'Volunteer registered successfully',
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Volunteer login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: 'Email and password required' });

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer)
      return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, volunteer.passwordHash);
    if (!isMatch)
      return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: volunteer._id, email: volunteer.email, role: 'volunteer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      msg: 'Login successful',
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
      },
      token,
    });
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

// Get volunteers nearby
exports.getNearby = async (req, res, next) => {
  try {
    const { lng, lat, radius = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ msg: 'lng & lat required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    };

    const volunteers = await Volunteer.find(query).limit(100);
    res.json(volunteers);
  } catch (err) {
    next(err);
  }
};