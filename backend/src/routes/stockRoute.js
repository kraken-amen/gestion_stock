const express = require('express');
const router = express.Router();
const { handleMovement, getRegionalStock } = require('../controllers/stockMoveController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllStocks, createStock, updateStock, deleteStock } = require('../controllers/stockController')
const { getDashboard } = require('../controllers/dashboardController')

router.post('/movement', protect, handleMovement);
router.get('/my-stock', protect, getRegionalStock);
router.get('/view', protect, getAllStocks)
router.post('/create', protect, createStock)
router.put('/update/:id', protect, updateStock)
router.delete('/delete/:id', protect, deleteStock)
router.get('/dashboard', protect, getDashboard)
module.exports = router;