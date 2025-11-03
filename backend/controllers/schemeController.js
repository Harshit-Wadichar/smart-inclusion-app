const Scheme = require('../models/Scheme');

exports.createScheme = async (req, res, next) => {
  try {
    const s = new Scheme(req.body);
    await s.save();
    res.status(201).json(s);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const schemes = await Scheme.find({}).sort({ startDate: -1 });
    res.json(schemes);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const s = await Scheme.findById(req.params.id);
    if (!s) return res.status(404).json({ msg: 'Not found' });
    res.json(s);
  } catch (err) { next(err); }
};

exports.deleteScheme = async (req, res, next) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) { next(err); }
};
