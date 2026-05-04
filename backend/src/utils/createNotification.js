const Notification = require('../models/Notification');

const createNotification = async ({ user, title, message, type }) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type
    });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};

module.exports = createNotification;