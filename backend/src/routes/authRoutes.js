const express = require("express");
const router = express.Router();
const { login, verifyCode, createUserByAdmin,
    getAllUsers,updateUser,deleteUser,
    toggleUserStatus,resendOtp } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
//us3
router.post("/create-user",protect,authorizeRoles("administrateur"),createUserByAdmin);
//us1
router.get("/users", getAllUsers);
//us1
router.post("/login", login);
//us1
router.post("/verify-otp", verifyCode);
//us3
router.put("/update-user/:id", protect, authorizeRoles("administrateur"),updateUser);
//us3
router.patch("/toggle-status/:id", protect, authorizeRoles("administrateur"),toggleUserStatus);
//us1
router.post("/resend-otp", resendOtp);
//us3
router.delete("/delete-user/:id", protect, authorizeRoles("administrateur"),deleteUser);
module.exports = router;