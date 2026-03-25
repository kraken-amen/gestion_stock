const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController")

router.get('/', getAllProducts)
router.post('/', protect, authorizeRoles("administrateur"), createProduct)
router.put('/:id', protect, authorizeRoles("administrateur"), updateProduct)
router.delete('/:id', protect, authorizeRoles("administrateur"), deleteProduct)

module.exports = router