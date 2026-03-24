const express = require('express');
const router = express.Router();
const demandeController = require('../controllers/demandeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
router.use(protect);

router.post('/', authorizeRoles("responsable region"), demandeController.createDemande);
router.get('/', authorizeRoles("responsable region"), demandeController.getAllDemandes);
router.get('/:id', authorizeRoles("responsable region"), demandeController.getDemandeById);
router.delete('/:id', authorizeRoles("responsable region"), demandeController.deleteDemande);

router.put('/approve/:requestId', authorizeRoles("administrateur"), demandeController.approveRequest);
router.put('/reject/:id', authorizeRoles("administrateur"), demandeController.rejectDemande);

module.exports = router;