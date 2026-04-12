const mongoose = require("mongoose");
const Region = require('../utils/Region');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["administrateur", "responsable region", "utilisateur", "Gestionnaire de Stock"],
        default: "utilisateur"
    },
    region: {
        type: String,
        enum: Region,
        required: function () {
            return this.role === "responsable region";
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);