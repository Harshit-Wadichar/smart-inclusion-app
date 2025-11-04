const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// Registration and login
router.post('/register', volunteerController.register);
router.post('/login', volunteerController.login);

// Volunteer data
router.get('/', volunteerController.getAll);
router.get('/nearby', volunteerController.getNearby);

module.exports = router;