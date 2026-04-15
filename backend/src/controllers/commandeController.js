const Commande = require('../models/Commande');
exports.getCommandes = async (req, res) => {
    try {
        const commandes = await Commande.find().populate({
            path: 'demande_id',
            populate: [
                { 
                    path: 'user_id', 
                    populate: { path: 'region' } 
                },
                { 
                    path: 'items.product_id',
                    populate:{path:'codeArticle'}
                }
            ]
        });
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};