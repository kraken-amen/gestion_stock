const Stock = require('../models/Stock');
const Movement = require('../models/Movements');
const mongoose = require('mongoose');

exports.handleMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { stock_id, quantityChange, type } = req.body; 
    const stock = await Stock.findById(stock_id).session(session);
    if (!stock) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Stock non trouvé" });
    }
    const change = Number(quantityChange);
    const newQuantity = type === 'entree' ? stock.quantite + change : stock.quantite - change;

    if (newQuantity < 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Stock insuffisant" });
    }

    // Movements
    await Movement.create([{
      stock_id: stock._id,
      quantite: change,
      type: type
    }], { session });

    // stock update
    stock.quantite = newQuantity;
    await stock.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Mouvement enregistré avec succès", stock });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  } finally {
    session.endSession();
  }
};
exports.getRegionalStock = async (req, res) => {
  try {
    // populate('product_id')
    const stocks = await Stock.find({ region: req.user.region }).populate('product_id', 'libelle prix codeArticle'); 
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du stock" });
  }
};
exports.getMovementsByStock = async (req, res) => {
  const { stock_id } = req.params;
  const history = await Movement.find({ stock_id }).sort({ dateMovement: -1 });
  res.json(history);
};