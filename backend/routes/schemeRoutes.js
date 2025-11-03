const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const auth = require('../middleware/authMiddleware');

router.get('/', schemeController.getAll);
router.post('/', auth, schemeController.createScheme); // admin creates schemes
router.get('/:id', schemeController.getById);
router.delete('/:id', auth, schemeController.deleteScheme);

module.exports = router;
