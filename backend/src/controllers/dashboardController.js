import Product from '../models/Product.js';
import Stock from '../models/Stock.js';
import Demande from '../models/Demande.js';
import Commande from '../models/Commande.js';
import StockMovement from '../models/Movements.js';
import User from '../models/User.js';
// KPI Stats (Total Products, Stock, Alerts...)
export const getKpiStats = async (req, res) => {
  try {

    const [totalProducts, demandesCount, commandesCount, totalUser] = await Promise.all([
      Product.countDocuments(),
      Demande.countDocuments(),
      Commande.countDocuments(),
      User.countDocuments()
    ]);

    const totalStockAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$quantite"
          }
        }
      }
    ]);

    const lowStockProducts = await Product.find({
      quantite: { $lte: 20 }
    });

    res.json({
      totalProducts,
      totalStock: totalStockAgg[0]?.total || 0,
      demandes: demandesCount,
      commandes: commandesCount,
      users: totalUser,
      lowStockProducts,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Stock by Region 
export const getStockByRegion = async (req, res) => {
  try {
    const data = await Stock.aggregate([
      {
        $group: {
          _id: "$region",
          value: { $sum: "$quantite" }
        }
      },
      {
        $sort: { value: -1 }
      },
      {
        $limit: 6
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Stock Evolution 
export const getStockEvolution = async (req, res) => {
  try {
    const data = await StockMovement.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$dateMovement" },
            month: { $month: "$dateMovement" }
          },
          stock: {
            $sum: {
              $cond: [
                { $ifNull: ["$from", false] },
                { $multiply: ["$quantite", 1] },
                "$quantite"
              ]
            }
          }
        }
      },
      {
        $sort: { "_id.month": 1, "_id.day": 1 }
      }
    ]);

    const formatted = data.map(d => ({
      date: `${d._id.day}/${d._id.month}`,
      stock: d.stock
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// demandes and commandes stats
export const getStatutsStats = async (req, res) => {
  try {
    const [demandes, commandes] = await Promise.all([
      Demande.aggregate([
        { $match: { status: { $in: ['EN_ATTENTE', 'REJETEE', 'ACCEPTEE'] } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Commande.aggregate([
        { $match: { status: { $in: ['EXPEDIEE', 'EN_PREPARATION', 'LIVREE'] } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const getCount = (arr, status) => arr.find(item => item._id === status)?.count || 0;

    const enCoursTotal =
      getCount(commandes, 'EXPEDIEE') +
      getCount(commandes, 'EN_PREPARATION');

    const finalStats = [
      { name: 'En attente', value: getCount(demandes, 'EN_ATTENTE') },
      { name: 'Rejetées', value: getCount(demandes, 'REJETEE') },
      { name: 'Livrées', value: getCount(commandes, 'LIVREE') },
      { name: 'En cours', value: enCoursTotal }
    ];

    res.json(finalStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// top products
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Demande.aggregate([
      { $match: { status: { $ne: "REJETEE" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          totalQty: { $sum: "$items.quantite" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: null,
          all: {
            $push: {
              name: "$productInfo.libelle",
              qty: "$totalQty"
            }
          },
          grandTotal: { $sum: "$totalQty" }
        }
      },
      { $unwind: "$all" },
      {
        $project: {
          _id: 0,
          name: "$all.name",
          value: {
            $round: [
              { $multiply: [{ $divide: ["$all.qty", "$grandTotal"] }, 100] },
              0
            ]
          }
        }
      },

      { $sort: { value: -1 } },
      { $limit: 5 }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// active alerts
export const getActiveAlerts = async (req, res) => {
  try {
    const lowStock = await Stock.find({ quantite: { $lte: 10 } })
      .populate('product_id', 'libelle')
      .select('product_id quantite region')
      .limit(3);

    const alerts = lowStock.map(p => ({
      type: 'CRITICAL',
      message: `Stock critique — ${p.product_id?.libelle}`,
      details: `${p.quantite} unités restantes`
    }));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// recent demandes
export const getRecentDemandes = async (req, res) => {
  try {
    const demandes = await Demande.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('items.product_id', 'codeArticle')
      .populate('user_id', 'region');

    const formatted = demandes.map(d => ({
      id: d._id,
      productName: d.items[0]?.product_id?.codeArticle || "Produit inconnu",
      to: d.user_id?.region || "Inconnu",
      status: d.status,
      time: d.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// recent commandes
export const getRecentCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('items.product_id', 'codeArticle');

    const formatted = commandes.map(c => ({
      id: c._id,
      productName: c.items[0]?.product_id?.codeArticle || "Produit inconnu",
      qty: c.items[0]?.quantite || 0,
      region: c.region,
      status: c.status
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// recent movements
export const getRecentMovements = async (req, res) => {
  try {
    const movements = await StockMovement.aggregate([
      { $sort: { dateMovement: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 1,
          productName: "$productInfo.libelle",
          quantity: "$quantite",
          time: "$dateMovement",
          region: "$region"
        }
      }
    ]);

    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getGlobalStats = async (req, res) => {
    try {
        const stats = await Stock.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: "$quantite" },
                    activeRegions: { $addToSet: "$region" }
                }
            },
            {
                $project: {
                    _id: 0,
                    valeurTotale: { $ifNull: ["$totalValue", 0] },
                    countZonesActives: { $size: "$activeRegions" }
                }
            }
        ]);
        const result = stats[0] || { valeurTotale: 0, countZonesActives: 0 };
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getMapData = async (req, res) => {
    try {
        const mapData = await Stock.aggregate([
            {
                $group: {
                    _id: "$region",
                    totalStock: { $sum: "$quantite" }
                }
            },
            {
                $project: {
                    _id: 0,
                    region: "$_id",
                    hasStock: { $gt: ["$totalStock", 0] }
                }
            }
        ]);
        res.status(200).json(mapData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};