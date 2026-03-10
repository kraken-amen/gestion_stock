const mongoose = require('mongoose');
const Region = require('../utils/Region');
const StockSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Le produit est obligatoire"]
  },
  quantite: {
    type: Number,
    default: 0
  },
  region: {
    type: String,
    enum: Region,
    required: [true, "La region est obligatoire"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Stock", StockSchema);