const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getMovements } = require('../controllers/movementsController');
const router = express.Router();
router.use(protect);
router.get('/',authorizeRoles("administrateur"), getMovements);
module.exports = router;