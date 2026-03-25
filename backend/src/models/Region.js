const mongoose = require('mongoose');
const RegionSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom de la région est obligatoire"],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Region", RegionSchema);