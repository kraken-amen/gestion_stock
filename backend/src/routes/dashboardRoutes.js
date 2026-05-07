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
    getRecentMovements,
    getGlobalStats,
    getMapData
} = require('../controllers/dashboardController')
const { protect,authorizeRoles } = require('../middleware/authMiddleware');
router.use(protect);

// Routes
router.get('/stats', authorizeRoles("administrateur"), getKpiStats);
router.get('/stock-by-region', authorizeRoles("administrateur"), getStockByRegion);
router.get('/stock-evolution', authorizeRoles("administrateur"), getStockEvolution);
router.get('/status-stats', authorizeRoles("administrateur"), getStatutsStats);
router.get('/top-products', authorizeRoles("administrateur"), getTopProducts);
router.get('/alerts', authorizeRoles("administrateur"), getActiveAlerts);
router.get('/recent',authorizeRoles("administrateur"), getRecentDemandes);
router.get('/recent-commandes', authorizeRoles("administrateur"), getRecentCommandes);
router.get('/history', authorizeRoles("administrateur"), getRecentMovements);
// Routes map
router.get('/global-stats', authorizeRoles("administrateur"), getGlobalStats);
router.get('/map-data', authorizeRoles("administrateur"), getMapData);
module.exports = router;
