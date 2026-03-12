const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { handleMovement, getRegionalStock, getMovementsByStock } = require('../controllers/movementsController');
const router = express.Router();
//us4
router.post('/movement', protect ,authorizeRoles("administrateur","responsable region"), handleMovement);
//us4
router.get('/my-stock', protect, getRegionalStock);
//us4
router.get('/history/:stock_id', protect, getMovementsByStock);
module.exports = router;