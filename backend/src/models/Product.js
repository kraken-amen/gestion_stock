const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // code article
  codeArticle: {
    type: String,
    required: [true, "Le code article est obligatoire"],
    unique: true,
    trim: true
  },
  // libelle
  libelle: {
    type: String,
    required: [true, "Le libellé est obligatoire"],
    trim: true
  },
  // unite
  unite: {
    type: String,
    required: [true, "L'unité est obligatoire"],
    default: 'Pièce'
  },
  // quantite
  quantite: {
    type: Number,
    required: true,
    default: 0
  },
  // dateMovement
  dateMovement: {
    type: Date,
    default: Date.now
  },
  // region
  region: {
    type: String,
    required: [true, "La region est obligatoire pour la gestion locale"]
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Product', ProductSchema);