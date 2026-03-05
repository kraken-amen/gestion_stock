const Product = require('../models/Product');
//us4
exports.handleMovement = async (req, res) => {
  try {
    const { codeArticle, quantityChange, type } = req.body; 
    const product = await Product.findOne({ codeArticle });

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    let newQuantity = type === 'entree' 
      ? product.quantite + Number(quantityChange) 
      : product.quantite - Number(quantityChange);
    if (newQuantity < 0) {
      return res.status(400).json({ message: "Stock insuffisant pour cette sortie" });
    }

    product.quantite = newQuantity;
    product.dateMovement = Date.now(); 
    await product.save();

    res.status(200).json({ message: "Mouvement enregistré", product });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getRegionalStock = async (req, res) => {
  try {
    const products = await Product.find({ region: req.user.region });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du stock" });
  }
};