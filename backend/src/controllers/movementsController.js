const Stock = require('../models/Stock');
const Movement = require('../models/Movements');
const mongoose = require('mongoose');

exports.handleMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { commande_id, quantite, type, from, to } = req.body;
    // validate type
    if (!["entree", "sortie"].includes(type)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Type invalide" });
    }

    const stock = await Stock.findById(stock_id).session(session);
    if (!stock) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Stock non trouvé" });
    }

    //security: responsable region 
    if (req.user.role === "responsable region" && stock.region !== req.user.region) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Accès interdit à cette région" });
    }

    const change = Number(quantityChange);

    if (isNaN(change) || change <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Quantité invalide" });
    }

    const newQuantity =
      type === "entree"
        ? stock.quantite + change
        : stock.quantite - change;

    if (newQuantity < 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Stock insuffisant" });
    }

    //  create movement
    await Movement.create(
      [
        {
          stock_id: stock._id,
          product_id: stock.product_id,
          quantite: change,
          type: type,
          user_id: req.user.id
        }
      ],
      { session }
    );

    // update stock
    stock.quantite = newQuantity;
    await stock.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: "Mouvement enregistré avec succès",
      stock
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  } finally {
    session.endSession();
  }
};
exports.getRegionalStock = async (req, res) => {
  try {
    let filter = {};

    // responsable region 
    if (req.user.role === "responsable region") {
      filter.region = req.user.region;
    }

    const stocks = await Stock.find(filter)
      .populate("product_id", "libelle prix codeArticle");

    res.status(200).json(stocks);

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du stock"
    });
  }
};
exports.getMovementsByStock = async (req, res) => {
  try {
    const { stock_id } = req.params;

    const history = await Movement.find({ stock_id })
      .populate("product_id", "libelle")
      .populate("user_id", "email")
      .sort({ dateMovement: -1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des mouvements"
    });
  }
};