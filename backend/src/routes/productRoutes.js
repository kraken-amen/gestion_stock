const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController")
router.use(protect);

router.get('/', getAllProducts)
router.post('/', authorizeRoles("administrateur"), createProduct)
router.put('/:id', authorizeRoles("administrateur"), updateProduct)
router.delete('/:id', authorizeRoles("administrateur"), deleteProduct)

module.exports = router