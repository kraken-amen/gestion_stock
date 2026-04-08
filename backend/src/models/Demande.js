const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ["EN_ATTENTE", "REJETEE", "ACCEPTEE"],
    default: "EN_ATTENTE"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Demande", demandeSchema);