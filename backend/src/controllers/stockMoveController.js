const Stock = require('../models/Stock');
//us4
exports.handleMovement = async (req, res) => {
  try {
    const { codeArticle, quantityChange, type } = req.body; 
    const stock = await Stock.findOne({ codeArticle });

    if (!stock) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    let newQuantity = type === 'entree' 
      ? stock.quantite + Number(quantityChange) 
      : stock.quantite - Number(quantityChange);
    if (newQuantity < 0) {
      return res.status(400).json({ message: "Stock insuffisant pour cette sortie" });
    }

    stock.quantite = newQuantity;
    stock.dateMovement = Date.now(); 
    await stock.save();

    res.status(200).json({ message: "Mouvement enregistré", stock });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getRegionalStock = async (req, res) => {
  try {
    const stocks = await Stock.find({ region: req.user.region });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du stock" });
  }
};