const express = require('express');
const router = express.Router();
const { createDemande, getAllDemandes, getDemandeById, approveRequest, rejectDemande, deleteDemande, updateDemande ,deleteAllDemandes} = require('../controllers/demandeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/',authorizeRoles("responsable region"), createDemande);
router.get('/',authorizeRoles("responsable region","administrateur"), getAllDemandes);
router.get('/:id',authorizeRoles("responsable region","administrateur"), getDemandeById);
router.put('/:id',authorizeRoles("responsable region"), updateDemande);
router.delete('/:id',authorizeRoles("responsable region","administrateur"), deleteDemande);
router.patch('/approve/:id', authorizeRoles('administrateur'), approveRequest);
router.patch('/reject/:id', authorizeRoles('administrateur'), rejectDemande);
router.delete('/',authorizeRoles("administrateur"), deleteAllDemandes);

module.exports = router;