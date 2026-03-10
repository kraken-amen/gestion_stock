const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController")

router.get('/view', protect, getAllProducts)
router.post('/create', protect, createProduct)
router.put('/update/:id', protect,  updateProduct)
router.delete('/delete/:id', protect,  deleteProduct)

module.exports = router