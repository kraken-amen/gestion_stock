const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
    quantite: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SHIPPED', 'COMPLETED'],
        default: 'PENDING'
    },
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Demande", requestSchema);