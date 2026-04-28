const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllStocks, getStockById, createStock, deleteStock, registerStock, updateStock } = require('../controllers/stockController')
const { getDashboardOverview } = require('../controllers/dashboardController')
// router.use(protect);
router.get('/', getAllStocks)
router.get('/:id', getStockById)
router.post('/', authorizeRoles("responsable region"), createStock)
router.put('/:id', authorizeRoles("responsable region"), updateStock)
router.delete('/:id', authorizeRoles("responsable region"), deleteStock)
//us4
router.patch('/register/:id', authorizeRoles("responsable region"), registerStock)

module.exports = router;