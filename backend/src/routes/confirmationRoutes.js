const express = require('express');
const router = express.Router();
const { confirmReceipt, toggleEnregistered } = require('../controllers/confirmationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
router.use(protect);
router.patch('/confirm-receipt/:livraisonId', authorizeRoles('administrateur'), confirmReceipt);
//slock in depôt
router.patch('/enregistered/:stockId', authorizeRoles('responsable region'), toggleEnregistered);
module.exports = router;