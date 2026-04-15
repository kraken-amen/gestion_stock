const Product = require("../models/Product")
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: 'unite'
    })
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Produit supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.getProductByCode = async (req, res) => {
  try {
    const product = await Product.findOne({ codeArticle: req.params.codeArticle })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.deleteProductByCode = async (req, res) => {
  try {
    await Product.findOneAndDelete({ codeArticle: req.params.codeArticle })
    res.json({ message: "Produit supprimé" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
