const mongoose = require('mongoose');
const Livraison = require('../models/Livraison');
const Commande = require('../models/Commande');
const Stock = require('../models/Stock');
exports.getConfirmReceipt = async (req, res) => {
    try {
        const livraisons = await Livraison.find().populate({
            path: 'commande_id',
            populate: { path: 'demande_id',populate: { path: 'user_id' ,populate: { path: 'region' }}}
        });
        res.json(livraisons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.confirmReceipt = async (req, res) => {
    const { livraisonId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const livraison = await Livraison.findById(livraisonId).populate({
            path: 'commande_id',
            populate: { path: 'demande_id',populate: { path: 'user_id' ,populate: { path: 'region' }}}
        }).session(session);

        if (!livraison) throw new Error("Livraison non trouvée");
        if (livraison.status === "LIVREE") throw new Error("Livraison déjà confirmée");

        const demande = livraison.commande_id.demande_id;

        for (let item of demande.items) {
            let stock = await Stock.findOne({ region: demande.user_id.region }).session(session);

            if (!stock) {
                stock = new Stock({
                    region: demande.user_id.region,
                    items: [{ product_id: item.product_id, quantite: item.quantite }],
                    enregisted: false 
                });
            } else {
                const itemIndex = stock.items.findIndex(
                    p => p.product_id.toString() === item.product_id.toString()
                );

                if (itemIndex > -1) {
                    stock.items[itemIndex].quantite += item.quantite;
                } else {
                    stock.items.push({ product_id: item.product_id, quantite: item.quantite });
                }
                
                stock.enregisted = false;
            }

            await stock.save({ session });
        }

        livraison.status = "LIVREE";
        await livraison.save({ session });

        await Commande.findByIdAndUpdate(livraison.commande_id._id, { status: "LIVREE" }, { session });

        await session.commitTransaction();
        res.json({ success: true, message: "Stock mis à jour (enregisted: true) et livraison terminée !" });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
exports.toggleEnregistered = async (req, res) => {
    const { stockId } = req.params;
    try {
        const stock = await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).json({ message: "Stock non trouvé" });
        }

        stock.enregisted = !stock.enregisted;

        await stock.save();

        res.json({ 
            success: true, 
            message: `Le stock est maintenant ${stock.enregisted ? 'enregistré' : 'non enregistré'}`,
            enregisted: stock.enregisted 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};