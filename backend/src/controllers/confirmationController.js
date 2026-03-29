const mongoose = require('mongoose');
const Livraison = require('../models/Livraison');
const Commande = require('../models/Commande');
const Demande = require('../models/Demande');
const Stock = require('../models/Stock');
const Movement = require('../models/Movements');
exports.confirmReceipt = async (req, res) => {
    const { livraisonId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const livraison = await Livraison.findById(livraisonId).populate({
            path: 'commande_id',
            populate: { path: 'demande_id' }
        }).session(session);

        if (!livraison) throw new Error("Livraison non trouvée");

        const demande = livraison.commande_id.demande_id;

        for (let item of demande.items) {   
            await Stock.findOneAndUpdate(
                { product_id: item.product_id, region: req.user.region },
                { $inc: { quantite: item.quantite } },
                { upsert: true, session }
            );

            await Movement.create([{
                livraison_id: livraison._id,
                product_id: item.product_id,
                to: req.user._id,
                quantite: item.quantite,
                type: 'ENTREE'
            }], { session });
        }

        livraison.status = "LIVREE";
        await livraison.save({ session });
        
        await Commande.findByIdAndUpdate(livraison.commande_id, { status: "LIVREE" }, { session });
        await Demande.findByIdAndUpdate(demande._id, { status: "ACCEPTEE" }, { session });

        await session.commitTransaction();
        res.json({ message: "Livraison confirmée et Stock mis à jour !" });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};