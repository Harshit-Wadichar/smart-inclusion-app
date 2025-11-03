const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const auth = require('../middleware/authMiddleware');

router.post('/', sosController.createSos);
router.get('/', auth, sosController.getAllSos); // admin-only
router.patch('/:id/status', auth, sosController.updateStatus);

module.exports = router;
