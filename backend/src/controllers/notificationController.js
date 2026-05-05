const Notification = require('../models/Notification');
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const region = req.user.region;

    let filter = {};

    if (role === "administrateur") {
      filter = {};
    } 
    else if (role === "responsable region") {
      filter = {
        $or: [
          { user: userId },          
          { region: region }          
        ]
      };
    } 
    else {
      filter = { user: userId };
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);

    if (!notif) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    notif.isRead = true;
    await notif.save();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteAllNotif = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'administrateur') {
      filter = { user: req.user._id };
    }

    const result = await Notification.deleteMany(filter);

    res.json({ 
      success: true, 
      message: req.user.role === 'administrateur' 
        ? "Toutes les notifications du système ont été supprimées" 
        : "Vos notifications ont été supprimées",
      deletedCount: result.deletedCount 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
