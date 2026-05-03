import Stock from '../models/Stock.js';

export const getRegionKPIs = async (req, res) => {
    try {
        const { regionName } = req.params;
        const kpis = await Stock.aggregate([
            { $match: { region: regionName } },
            {
                $group: {
                    _id: null,
                    totalProduits: { $count: {} },
                    stockGlobal: { $sum: "$quantite" },
                    stockFaible: {
                        $sum: { $cond: [{ $lt: ["$quantite", 10] }, 1, 0] }
                    },
                    demandesAttente: {
                        $sum: { $cond: [{ $eq: ["$enregisted", false] }, 1, 0] }
                    }
                }
            },
            { $project: { _id: 0 } }
        ]);

        res.status(200).json(kpis[0] || { totalProduits: 0, stockGlobal: 0, stockFaible: 0, demandesAttente: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRegionChartData = async (req, res) => {
    try {
        const { regionName } = req.params;
        const chartData = await Stock.aggregate([
            { $match: { region: regionName } },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $sort: { quantite: -1 } },
            { $limit: 6 },
            {
                $project: {
                    _id: 0,
                    quantite: 1,
                    product: 1 
                }
            }
        ]);

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRegionAlerts = async (req, res) => {
    try {
        const { regionName } = req.params;
        const alerts = await Stock.aggregate([
            { 
                $match: { 
                    region: regionName, 
                    quantite: { $lte: 50 }
                } 
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    productName: "$product.name",
                    quantite: 1,
                    status: { 
                        $cond: [{ $eq: ["$quantite", 0] }, "Rupture", "Faible"] 
                    }
                }
            }
        ]);

        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};