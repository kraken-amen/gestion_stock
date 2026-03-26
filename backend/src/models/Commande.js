const mongoose = require("mongoose");
const commandeSchema = new mongoose.Schema({
  demande_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Demande",
    required: true
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantite: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ["PREPARING", "SHIPPED", "DELIVERED"],
    default: "PREPARING"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Commande", commandeSchema);