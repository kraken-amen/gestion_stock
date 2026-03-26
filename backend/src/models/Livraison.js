const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema({
  commande_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commande",
    required: true
  },

  status: {
    type: String,
    enum: ["IN_TRANSIT", "DELIVERED"],
    default: "IN_TRANSIT"
  },

  shippedAt: {
    type: Date,
    default: Date.now
  },

  deliveredAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Livraison", livraisonSchema);