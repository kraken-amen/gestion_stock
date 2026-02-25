const express = require("express");
const router = express.Router();
const { login, verifyCode, createUserByAdmin,getAllUsers,getAvailableRoles } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
// Route pour l'Admin (US2: Création de compte)
router.post("/create-user",protect,adminOnly,createUserByAdmin);

// Routes pour l'Utilisateur (US1: Authentification Double Facteur)
router.get("/roles", protect, adminOnly, getAvailableRoles);
router.get("/users", protect, adminOnly, getAllUsers);
router.post("/login", login);
router.post("/otp", verifyCode);
router.put("/update-user/:id", protect, adminOnly, authController.updateUser);
router.patch("/toggle-status/:id", protect, adminOnly, authController.toggleUserStatus);
module.exports = router;