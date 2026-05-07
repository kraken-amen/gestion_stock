const Commande = require('../models/Commande');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const mongoose = require('mongoose');
const Movement = require('../models/Movements.js');
const Settings = require('../models/Settings.js');
const createNotification = require('../utils/createNotification');
const User = require("../models/User");
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
            const settings = await Settings.findOne({ user: req.user._id });
            console.log(settings);
            const minLimit = settings?.business?.stockMin;
            if (product.quantite <= minLimit) {
                try {
                    await createNotification({
                        title: "Alerte Stock Faible",
                        message: `Le produit ${product.codeArticle} est presque épuisé (${product.quantite} restants).`,
                        type: "STOCK"
                    });
                } catch (err) {
                    console.error("Stock Notif Error:", err);
                }
            }
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
        const commande = await Commande.findById(req.params.id)
            .populate({
                path: 'demande_id',
                populate: {
                    path: 'user_id'
                }
            });
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }
        if (commande.status !== 'EN_PREPARATION') {
            return res.status(400).json({ message: "Commande déjà traitée" });
        }
        commande.status = 'EXPEDIEE';
        await commande.save();
        let recipientId = commande.demande_id?.user_id?._id;
        if (!recipientId) {
            const admin = await User.findOne({ role: "administrateur" });
            recipientId = admin?._id;
        }
        if (commande.items?.length > 0 && recipientId) {
            const movements = commande.items.map(item => ({
                commande_id: commande._id,
                product_id: item.product_id,
                from: req.user?._id,
                to: recipientId,
                region: commande.region,
                quantite: item.quantite,
                dateMovement: new Date()
            }));

            await Movement.insertMany(movements);
        } else {
            console.warn("Mouvement non enregistré");
        }
        res.json(commande);

    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ message: "Erreur Serveur: " + error.message });
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
                await Stock.findOneAndUpdate(
                    {
                        product_id: item.product_id,
                        region: commande.region
                    },
                    {
                        $inc: { quantite: item.quantite },
                        $set: { date: new Date() }
                    },
                    {
                        session,
                        upsert: true,
                        new: true
                    }
                );
            }

            commande.status = 'LIVREE';
            await commande.save({ session });
            try {
                await createNotification({
                    user: commande.user_id,
                    title: "Mise à jour Commande",
                    message: `Votre commande #${commande._id.toString().slice(-6)} est maintenant livrée.`,
                    type: "COMMANDE"
                });
            } catch (err) {
                console.error("Commande Notif Error:", err);
            }
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const oldCommande = await Commande.findById(req.params.id).session(session);
        if (!oldCommande) {
            throw new Error("Commande non trouvée");
        }
        for (let oldItem of oldCommande.items) {
            await Product.findByIdAndUpdate(
                oldItem.product_id,
                { $inc: { quantite: oldItem.quantite } },
                { session }
            );
        }
        const updatedCommande = await Commande.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, session }
        );
        const settings = await Settings.findOne({ user: req.user._id }).session(session);
        const minLimit = settings?.business?.stockMin || 0;

        for (let newItem of updatedCommande.items) {
            const product = await Product.findById(newItem.product_id).session(session);

            if (!product) {
                throw new Error(`Produit ${newItem.product_id} non trouvé`);
            }

            if (product.quantite < newItem.quantite) {
                throw new Error(`Stock insuffisant pour ${product.libelle} (Dispo: ${product.quantite})`);
            }
            product.quantite -= newItem.quantite;
            await product.save({ session });
            if (product.quantite <= minLimit) {
                try {
                    await createNotification({
                        title: "Alerte Stock Faible",
                        message: `Le produit ${product.codeArticle} est presque épuisé (${product.quantite} restants).`,
                        type: "STOCK"
                    });
                } catch (err) {
                    console.error("Stock Notif Error:", err);
                }
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.json(updatedCommande);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};