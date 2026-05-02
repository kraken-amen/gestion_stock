const express = require('express');
const router = express.Router();
const { getKpiStats, 
    getStockByRegion, 
    getStockEvolution, 
    getStatutsStats,
    getTopProducts, 
    getActiveAlerts,
    getRecentDemandes,
    getRecentCommandes,
    getRecentMovements 
} = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware');
router.use(protect);

// Routes
router.get('/stats', getKpiStats);
router.get('/stock-by-region', getStockByRegion);
router.get('/stock-evolution', getStockEvolution);
router.get('/status-stats', getStatutsStats);
router.get('/top-products', getTopProducts);
router.get('/alerts', getActiveAlerts);
router.get('/recent', getRecentDemandes);
router.get('/recent-commandes', getRecentCommandes);
router.get('/history', getRecentMovements);
module.exports = router;
