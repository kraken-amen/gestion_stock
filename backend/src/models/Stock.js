const mongoose = require('mongoose');
const Region = require('../utils/Region');
const StockSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    enum: Region,
    required: [true, "La region est obligatoire"]
  },
    enregisted: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
StockSchema.index({ product_id: 1, region: 1 }, { unique: true });
module.exports = mongoose.model("Stock", StockSchema);