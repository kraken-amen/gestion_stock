const Livraison = require('../models/Livraison');
const Commande = require('../models/Commande');
const Demande = require('../models/Demande');
const Product = require('../models/Product');
const Movement = require('../models/Movements');
const mongoose = require('mongoose');

exports.createDemande = async (req, res) => {
    try {
        const newDemande = await Demande.create({
            user_id: req.user._id,
            items: req.body.items,
            status: "EN_ATTENTE"
        });
        res.status(201).json(newDemande);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllDemandes = async (req, res) => {
    try {
        const demandes = await Demande.find()
            .populate('items.product_id', 'codeArticle libelle prix')
            .populate('user_id', 'email role region')
            .sort({ createdAt: -1 });
        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDemandeById = async (req, res) => {
    try {
        const demande = await Demande.findById(req.params.id)
            .populate('items.product_id', 'codeArticle libelle prix')
            .populate('user_id', 'email role region');
        if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
        res.json(demande);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectDemande = async (req, res) => {
    try {
        const demande = await Demande.findById(req.params.id);
        if (demande.status !== 'EN_ATTENTE') throw new Error("Cette demande est déjà traitée");
        await Demande.findByIdAndUpdate(
            req.params.id,
            { status: 'REJETEE' },
            { new: true }
        );
        res.json({ message: "Demande rejetée", demande });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDemande = async (req, res) => {
    try {
        const demande = await Demande.findById(req.params.id);
        if (demande.status !== 'EN_ATTENTE') {
            return res.status(400).json({ message: "Impossible de supprimer une demande déjà traitée" });
        }
        await Demande.findByIdAndDelete(req.params.id);
        res.json({ message: "Demande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.approveRequest = async (req, res) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const demande = await Demande.findById(id).session(session);
        if (!demande) throw new Error("Demande non trouvée");
        if (demande.status !== 'EN_ATTENTE') throw new Error("Cette demande est déjà traitée");
        const [newCommande] = await Commande.create([{
            demande_id: demande._id,
            status: "EN_PREPARATION"
        }], { session });

        await Livraison.create([{
            commande_id: newCommande._id,
            status: "EN_TRANSIT"
        }], { session });

        for (let item of demande.items) {
            const product = await Product.findById(item.product_id).session(session);
            if (!product) {
                throw new Error(`Produit avec ID ${item.product_id} non trouvé`);
            }

            if (product.quantite < item.quantite) {
                throw new Error(`Stock insuffisant pour ${product.libelle}. Disponible: ${product.quantite}`);
            }

            product.quantite -= item.quantite;
            await product.save({ session });

            await Movement.create([{
                commande_id: newCommande._id,
                product_id: item.product_id,
                from: req.user._id,
                to: demande.user_id,
                quantite: item.quantite,
                type: 'SORTIE',
            }], { session });
        }

        demande.status = 'ACCEPTEE';
        await demande.save({ session });

        await session.commitTransaction();
        res.json({ message: "Demande approuvée." });

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};