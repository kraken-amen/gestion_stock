const express = require('express');
const router = express.Router();
const { handleMovement, getRegionalStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

router.post('/movement', protect, handleMovement);
router.get('/my-stock', protect, getRegionalStock);

module.exports = router;