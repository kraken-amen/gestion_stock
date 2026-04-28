const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "STOCK_LOW",
      "DEMANDE_DELAY",
      "COMMANDE_DELAY",
      "INFO"
    ]
  },

  message: String,
  detail: String,

  role: {
    type: String,
    enum: ["admin", "responsable"],
    default: "admin"
  },

  isRead: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Notification", NotificationSchema);