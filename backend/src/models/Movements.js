const mongoose = require('mongoose');
const MovementSchema = new mongoose.Schema({
    commande_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commande",
        required: true
    },
    product_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    quantite: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ["ENTREE", "SORTIE"],
        required: true
    },

    dateMovement: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model("Movement", MovementSchema);