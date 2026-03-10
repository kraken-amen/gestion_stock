const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  codeArticle: {
    type: String,
    required: [true, "Le code article est obligatoire"],
    unique: true,
    trim: true
  },

  libelle: {
    type: String,
    required: [true, "Le libellé est obligatoire"],
    trim: true
  },

  unite: {
    type: String,
    default: "Pièce"
  },

  quantite: {
    type: Number,
    default: 0
  },

  dateMovement: {
    type: Date,
    default: Date.now
  },

  region: {
    type: String,
    enum: ["administrateur","responsable region", "utilisateur"],
    required: [true, "La region est obligatoire"]
  }

}, { timestamps: true });

module.exports = mongoose.model("Stock", StockSchema);