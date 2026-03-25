const Demande = require('../models/demande');
const mongoose = require('mongoose');

exports.createDemande = async (req, res) => {
    try {
        const { product_id, quantite } = req.body;
        const newDemande = new Demande({
            product_id,
            quantite,
            region,
            user_id: req.user._id,
            status: 'PENDING'
        });
        await newDemande.save();
        res.status(201).json(newDemande);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllDemandes = async (req, res) => {
    try {
        const demandes = await Demande.find()
            .populate('product_id', 'nom libelle')
            .populate('region_id', 'nom')
            .sort({ date: -1 });
        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDemandeById = async (req, res) => {
    try {
        const demande = await Demande.findById(req.params.id)
            .populate('product_id')
            .populate('region_id');
        if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
        res.json(demande);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectDemande = async (req, res) => {
    try {
        const demande = await Demande.findByIdAndUpdate(
            req.params.id,
            { status: 'REJECTED' },
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
        if (demande.status !== 'PENDING') {
            return res.status(400).json({ message: "Impossible de supprimer une demande déjà traitée" });
        }
        await Demande.findByIdAndDelete(req.params.id);
        res.json({ message: "Demande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.approveRequest = async (req, res) => {
    const { requestId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const demande = await Demande.findById(requestId).session(session);
        if (!demande) throw new Error("Demande non trouvée");

        const centraleStock = await Stock.findOne({
            product_id: demande.product_id,
            region_id: demande.region_id
        }).session(session);

        if (!centraleStock || centraleStock.quantite < demande.quantite) {
            throw new Error("Stock Centrale insuffisant !");
        }

        centraleStock.quantite -= demande.quantite;
        await centraleStock.save({ session });

        await Movement.create([{
            stock_id: centraleStock._id,
            quantite: demande.quantite,
            type: 'sortie',
            description: `Transfert vers Region ${demande.region_id}`
        }], { session });

        demande.status = 'APPROVED';
        await demande.save({ session });

        await session.commitTransaction();
        res.json({ message: "Demande approuvée et la quantité a été déduite du stock central" });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};