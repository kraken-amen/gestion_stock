const mongoose = require("mongoose");
const commandeSchema = new mongoose.Schema({
  demande_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Demande"
  },
  status: {
    type: String,
    enum: ["EN_PREPARATION", "EXPEDIEE", "LIVREE"],
    default: "EN_PREPARATION"
  },
  description: {
    type: String,
    default: ""
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantite: {
        type: Number,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Commande", commandeSchema);