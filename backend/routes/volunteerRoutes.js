const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const auth = require('../middleware/authMiddleware');

router.post('/', volunteerController.createVolunteer);
router.get('/', volunteerController.getAll);
router.get('/nearby', volunteerController.getNearby);
module.exports = router;
