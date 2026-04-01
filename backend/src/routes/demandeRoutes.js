const express = require('express');
const router = express.Router();
const { createDemande, getAllDemandes, getDemandeById, approveRequest, rejectDemande, deleteDemande } = require('../controllers/demandeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/',authorizeRoles("responsable region"), createDemande);
router.get('/',authorizeRoles("responsable region","administrateur"), getAllDemandes);
router.get('/:id',authorizeRoles("responsable region","administrateur"), getDemandeById);
router.delete('/:id',authorizeRoles("responsable region","administrateur"), deleteDemande);
router.patch('/approve/:id', authorizeRoles('administrateur'), approveRequest);
router.patch('/reject/:id', authorizeRoles('administrateur'), rejectDemande);

module.exports = router;