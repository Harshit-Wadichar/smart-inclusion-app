const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/register', adminController.register); // run once or via seed
router.post('/login', adminController.login);

module.exports = router;