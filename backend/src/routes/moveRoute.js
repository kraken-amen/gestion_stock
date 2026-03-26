const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { handleMovement, getRegionalStock, getMovementsByStock } = require('../controllers/movementsController');
const router = express.Router();
router.use(protect);
//us4
router.post('/movement', authorizeRoles("administrateur","responsable region"), handleMovement);
//us4
router.get('/my-stock', getRegionalStock);
//us4
router.get('/history/:stock_id', getMovementsByStock);
module.exports = router;