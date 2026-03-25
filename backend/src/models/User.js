const mongoose = require("mongoose");

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
        enum: ["administrateur", "responsable region", "utilisateur"],
        default: "utilisateur"
    },
    region: {
        type: String,
        enum:
            [
                'tunis',
                'sfax',
                'sousse',
                'monastir',
                'nabeul',
                'beja',
                'bizerte',
                'gabes',
                'gafsa',
                'jendouba',
                'kasserine',
                'kairouan',
                'kebili',
                'ariana',
                'kef',
                'mahdia',
                'manouba',
                'medenine',
                'sidi bouzid',
                'siliana',
                'tozeur',
                'zaghouan',
                'tataouine',
                'ben arous',
            ],
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