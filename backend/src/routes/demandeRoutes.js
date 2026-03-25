const express = require('express');
const router = express.Router();
const demandeController = require('../controllers/demandeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
// router.use(protect);

router.post('/', demandeController.createDemande);
router.get('/', demandeController.getAllDemandes);
router.get('/:id', demandeController.getDemandeById);
router.delete('/:id', demandeController.deleteDemande);

router.put('/approve/:requestId', demandeController.approveRequest);
router.put('/reject/:id', demandeController.rejectDemande);

module.exports = router;