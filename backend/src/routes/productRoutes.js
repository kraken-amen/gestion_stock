const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController")

router.get('/view', protect, getAllProducts)
router.post('/create', protect, authorizeRoles("administrateur"), createProduct)
router.put('/update/:id', protect, authorizeRoles("administrateur"), updateProduct)
router.delete('/delete/:id', protect, authorizeRoles("administrateur"), deleteProduct)

module.exports = router