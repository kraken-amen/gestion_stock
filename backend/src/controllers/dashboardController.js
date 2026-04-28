import Product from '../models/Product.js';
import Stock from '../models/Stock.js';
import Demande from '../models/Demande.js';
import Commande from '../models/Commande.js';
import StockMovement from '../models/Movements.js';
import User from '../models/User.js';
// 1. KPI Stats (Total Products, Stock, Alerts...)
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

// 2. Stock by Region (Chart)
export const getStockByRegion = async (req, res) => {
  try {
    const data = await Stock.aggregate([
      { $lookup: { from: "regions", localField: "region", foreignField: "_id", as: "region" } },
      { $unwind: "$region" },
      { $group: { _id: "$region.name", value: { $sum: "$quantity" } } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Stock Evolution (Chart - Last 30 Days)
export const getStockEvolution = async (req, res) => {
  try {
    const data = await StockMovement.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, value: { $sum: "$quantity" } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Recent Activities (Table)
export const getRecentActivities = async (req, res) => {
  try {
    const recentRequests = await Demande.find().sort({ createdAt: -1 }).limit(5).populate('product');
    res.json(recentRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};