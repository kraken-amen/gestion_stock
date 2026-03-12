const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllStocks, createStock, updateStock, deleteStock, registerStock } = require('../controllers/stockController')
const { getDashboard } = require('../controllers/dashboardController')

router.get('/view', protect, getAllStocks)
router.post('/create', protect, authorizeRoles("administrateur"), createStock)
router.put('/update/:id', protect, authorizeRoles("administrateur"), updateStock)
router.delete('/delete/:id', protect, authorizeRoles("administrateur"), deleteStock)
//us4
router.patch('/register/:id', protect,authorizeRoles("responsable region"), registerStock)
//us5
router.get('/dashboard', protect, getDashboard)
module.exports = router;