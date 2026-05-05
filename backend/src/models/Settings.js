const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  notifications: {
    demande: { type: Boolean, default: true },
  },
  business: {
    stockMin: { type: Number, default: 10 },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique:  true
  }
}, { timestamps: true });

module.exports = mongoose.model("Settings", SettingsSchema);