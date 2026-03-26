const express = require('express');
const router = express.Router();
const { confirmReceipt } = require('../controllers/confirmationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.patch('/confirm-receipt/:livraisonId', protect, authorizeRoles('responsable region'), confirmReceipt);

module.exports = router;