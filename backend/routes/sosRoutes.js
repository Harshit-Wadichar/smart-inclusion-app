const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const {auth} = require('../middleware/authMiddleware');

// Public route (no auth required for creating SOS)
router.post('/', sosController.createSos);

// Protected routes (require authentication)
router.get('/', auth, sosController.getAllSos); // admin-only
router.patch('/:id/status', auth, sosController.updateStatus);

// Public route to get open SOS cases
router.get('/public', async (req, res, next) => {
  try {
    const SOS = require('../models/SOS');
    const list = await SOS.find({ status: 'open' })
      .select('-user -__v') // exclude sensitive fields
      .sort({ createdAt: -1 })
      .limit(200);
    
    res.json({
      success: true,
      data: list
    });
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;