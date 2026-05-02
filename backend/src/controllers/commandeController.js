const Commande = require('../models/Commande');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const mongoose = require('mongoose');
const Movement = require('../models/Movements');

exports.getCommandes = async (req, res) => {
    try {
        const commandes = await Commande.find()
            .populate({
                path: 'demande_id',
                populate: [
                    {
                        path: 'user_id',
                        populate: { path: 'region' }
                    },
                    {
                        path: 'items.product_id',
                        populate: { path: 'codeArticle' }
                    }
                ]
            })
            .populate({
                path: 'items.product_id'
            });
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCommande = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [commande] = await Commande.create([req.body], { session });

        for (let item of commande.items) {
            const product = await Product.findById(item.product_id).session(session);

            if (!product) {
                throw new Error(`Produit ${item.product_id} non trouvé`);
            }

            if (product.quantite < item.quantite) {
                throw new Error(`Stock insuffisant pour ${product.libelle}`);
            }

            product.quantite -= item.quantite;
            await product.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(commande);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ message: error.message });
    }
};

exports.deleteCommande = async (req, res) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const commande = await Commande.findById(id).session(session);

        if (!commande) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (commande.status === 'EN_PREPARATION') {
            for (let item of commande.items) {
                const product = await Product.findById(item.product_id).session(session);

                if (!product) {
                    throw new Error(`Produit ${item.product_id} non trouvé`);
                }

                product.quantite += item.quantite;
                await product.save({ session });
            }
        }

        await Commande.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Commande supprimée et stock mis à jour si nécessaire"
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ message: error.message });
    }
};
exports.expedierCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    if (commande.status !== 'EN_PREPARATION') {
      return res.status(400).json({ message: "Commande déjà traitée" });
    }

    commande.status = 'EXPEDIEE';
    await commande.save();

    const movements = commande.items.map(item => ({
      commande_id: commande._id,
      product_id: item.product_id,
      from: req.user._id,
      to: commande.user_id,
      region: commande.region,
      quantite: item.quantite,
      dateMovement: new Date()
    }));

    await Movement.insertMany(movements);

    res.json(commande);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.livreeCommande = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const commande = await Commande.findById(req.params.id).session(session);

        if (!commande) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (commande.status === 'EXPEDIEE') {
            for (let item of commande.items) {
                await Stock.create([{
                    product_id: item.product_id,
                    quantite: item.quantite,
                    region: commande.region,
                    date: new Date()
                }], { session });
            }

            commande.status = 'LIVREE';
            await commande.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.json(commande);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ message: error.message });
    }
};
exports.updateCommande = async (req, res) => {
    try {
        const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!commande) return res.status(404).json({ message: "Commande non trouvée" });
        res.json(commande);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};