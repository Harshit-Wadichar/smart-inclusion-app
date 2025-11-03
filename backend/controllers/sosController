const SOS = require('../models/SOS');

exports.createSos = async (req, res, next) => {
  try {
    const { lat, lng, message, userId, metadata } = req.body;
    if (!lat || !lng) return res.status(400).json({ msg: 'lat & lng required' });

    const sos = new SOS({
      userId: userId || null,
      message: message || '',
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      metadata: metadata || {}
    });

    await sos.save();

    // emit via socket.io to all connected clients (volunteers/admins)
    const io = req.app.get('io');
    if (io) io.emit('sosAlert', { id: sos._id, lat, lng, message: sos.message, createdAt: sos.createdAt });

    res.status(201).json({ ok: true, sos });
  } catch (err) { next(err); }
};

exports.getAllSos = async (req, res, next) => {
  try {
    const list = await SOS.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(list);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const sos = await SOS.findByIdAndUpdate(req.params.id, { status }, { new: true });
    const io = req.app.get('io');
    if (io) io.emit('sosUpdate', { id: sos._id, status });
    res.json(sos);
  } catch (err) { next(err); }
};
