const express = require('express');
const router = express.Router();

const { 
    getRegionKPIs, 
    getRegionChartData, 
    getRegionAlerts 
} = require('../controllers/dashbordRegionalController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/kpis/:regionName', getRegionKPIs);
router.get('/chart/:regionName', getRegionChartData);
router.get('/alerts/:regionName', getRegionAlerts);

module.exports = router;