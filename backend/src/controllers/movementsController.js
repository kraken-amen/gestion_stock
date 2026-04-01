const Movement = require('../models/Movements');
const Product = require('../models/Product');
const mongoose = require('mongoose');
exports.getMovements = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "responsable region") {
      filter.region = req.user.region;
    }

    const history = await Movement.find(filter)
      .populate("product_id", "libelle codeArticle")
      .populate("user_id", "email role")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des mouvements" });
  }
};
exports.handleMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { product_id, quantite, type } = req.body;

    const qty = Number(quantite);
    if (isNaN(qty) || qty <= 0) {
      throw new Error("La quantité doit être un nombre positif");
    }

    const product = await Product.findById(product_id).session(session);
    if (!product) {
      throw new Error("Produit non trouvé dans le stock central");
    }

      if (product.quantite < qty) {
        throw new Error(`Stock insuffisant. Disponible: ${product.quantite}`);
      }
      product.quantite -= qty;

    await product.save({ session });


    await session.commitTransaction();
    res.status(200).json({
      message: `Mouvement ${type} effectué avec succès`,
      newStock: product.quantite,
      movement: movement[0]
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.getProductHistory = async (req, res) => {
  try {
    const { product_id } = req.params;
    const history = await Movement.find({ product_id })
      .populate('user_id', 'email')
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};