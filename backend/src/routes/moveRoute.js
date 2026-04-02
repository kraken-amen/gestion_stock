const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getMovements, getProductHistory } = require('../controllers/movementsController');
const router = express.Router();
router.use(protect);
//us4
router.get('/:product_id', getProductHistory);
router.get('/', getMovements);
module.exports = router;