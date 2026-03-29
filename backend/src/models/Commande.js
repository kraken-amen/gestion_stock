const mongoose = require("mongoose");
const commandeSchema = new mongoose.Schema({
  demande_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Demande",
    required: true
  },
  status: {
    type: String,
    enum: ["EN_PREPARATION", "EXPEDIEE", "LIVREE"],
    default: "EN_PREPARATION"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Commande", commandeSchema);