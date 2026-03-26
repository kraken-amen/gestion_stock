const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllStocks, createStock, updateStock, deleteStock, registerStock } = require('../controllers/stockController')
const { getDashboard } = require('../controllers/dashboardController')
router.use(protect);

router.get('/', getAllStocks)
router.post('/', authorizeRoles("administrateur"), createStock)
router.put('/:id', authorizeRoles("administrateur"), updateStock)
router.delete('/:id', authorizeRoles("administrateur"), deleteStock)
//us4
router.patch('/register/:id', authorizeRoles("responsable region"), registerStock)
//us5
router.get('/dashboard', getDashboard)
module.exports = router;