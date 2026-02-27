const express = require("express");
const router = express.Router();
const { login, verifyCode, createUserByAdmin,
    getAllUsers,getAvailableRoles,updateUser,
    toggleUserStatus,resendOtp } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
// Route pour l'Admin (US2: Création de compte)
router.post("/create-user",protect,adminOnly,createUserByAdmin);

// Routes pour l'Utilisateur (US1: Authentification Double Facteur)
router.get("/roles", protect, adminOnly, getAvailableRoles);
router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/verify-otp", verifyCode);
router.put("/update-user/:id", protect, adminOnly,updateUser);
router.patch("/toggle-status/:id", protect, adminOnly,toggleUserStatus);
router.post("/resend-otp", resendOtp);
module.exports = router;