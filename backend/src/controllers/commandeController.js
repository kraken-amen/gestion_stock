const Commande = require('../models/Commande');
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
    try {
        const commande = await Commande.create(req.body);
        res.status(201).json(commande);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCommande = async (req, res) => {
    try {
        const commande = await Commande.findByIdAndDelete(req.params.id);
        if (!commande) return res.status(404).json({ message: "Commande non trouvée" });
        res.json(commande);
    } catch (error) {
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