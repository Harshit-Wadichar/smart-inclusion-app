const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const auth = require('../middleware/authMiddleware');

router.get('/nearby', placeController.getNearby);
router.get('/', placeController.getAll);
router.get('/:id', placeController.getById);
router.post('/', placeController.createPlace); // allow public submit - moderation on server
router.delete('/:id', auth, placeController.deletePlace); // admin only

module.exports = router;
