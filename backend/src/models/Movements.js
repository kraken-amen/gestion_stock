const mongoose = require('mongoose');
const MovementSchema = new mongoose.Schema({
    stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: [true, "Le produit est obligatoire"]
    },
    quantite: {
        type: Number,
        required: [true, "La quantité est obligatoire"]
    },
    type: {
        type: String,
        enum: ["entree", "sortie"],
        required: [true, "Le type est obligatoire"]
    },
    dateMovement: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Movement", MovementSchema);
