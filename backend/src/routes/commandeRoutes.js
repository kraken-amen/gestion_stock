const express = require('express');
const router = express.Router();
const { getCommandes } = require('../controllers/commandeController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/', getCommandes);
module.exports = router;