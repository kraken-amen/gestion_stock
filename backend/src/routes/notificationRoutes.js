const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteAllNotif
} = require('../controllers/notificationController');

const { protect ,authorizeRoles} = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getNotifications);
router.patch('/read/:id', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/',authorizeRoles("administrateur"),deleteAllNotif);
module.exports = router;