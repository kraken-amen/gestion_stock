const express = require('express');
const router = express.Router();
const { createDemande, getAllDemandes, getDemandeById, deleteDemande, approveRequest, rejectDemande } = require('../controllers/demandeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
router.use(protect);

router.post('/', createDemande);
router.get('/', getAllDemandes);
router.get('/:id', getDemandeById);
router.delete('/:id', authorizeRoles("administrateur", "responsable region"), deleteDemande);

router.put('/approve/:requestId', authorizeRoles("administrateur"), approveRequest);
router.put('/reject/:id', authorizeRoles("administrateur"), rejectDemande);

module.exports = router;