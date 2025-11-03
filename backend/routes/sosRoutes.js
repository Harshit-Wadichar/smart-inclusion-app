const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const auth = require('../middleware/authMiddleware');

router.post('/', sosController.createSos);
router.get('/', auth, sosController.getAllSos); // admin-only
router.patch('/:id/status', auth, sosController.updateStatus);

// add near other routes in backend/routes/sosRoutes.js
router.get('/public', async (req, res, next) => {
  try {
    const SOS = require('../models/SOS');
    const list = await SOS.find({ status: 'open' }).sort({ createdAt: -1 }).limit(200);
    res.json(list);
  } catch (err) { next(err); }
});


module.exports = router;
