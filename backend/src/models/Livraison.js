const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema({
  commande_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commande",
    required: true
  },

  status: {
    type: String,
    enum: ["EN_TRANSIT", "LIVREE"],
    default: "EN_TRANSIT"
  },

  shippedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Livraison", livraisonSchema);