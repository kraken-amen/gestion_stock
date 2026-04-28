const express = require('express');
const router = express.Router();
const { getKpiStats, getStockByRegion, getStockEvolution, getRecentActivities } = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware');
router.use(protect);

// Routes
router.get('/stats', getKpiStats);
router.get('/stock-by-region', getStockByRegion);
router.get('/stock-evolution', getStockEvolution);
router.get('/activities', getRecentActivities);

module.exports = router;
