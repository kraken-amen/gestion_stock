const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
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
  prix: {
    type: Number,
    required: [true, "Le prix est obligatoire"]
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);