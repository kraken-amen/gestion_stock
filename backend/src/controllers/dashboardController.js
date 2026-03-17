const Stock = require("../models/Stock");
const Product = require("../models/Product");

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const stockStats = await Stock.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantite" },
          totalValue: { $sum: { $multiply: ["$quantite", "$product_info.prix"] } }
        }
      }
    ]);

    const categoryData = await Stock.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" },
      {
        $group: {
          _id: "$product_info.categorie",
          value: { $sum: "$quantite" }
        }
      },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Regional Performance & Stock By Region
    const stockByRegion = await Stock.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" },
      {
        $group: {
          _id: "$region",
          totalQuantity: { $sum: "$quantite" },
          totalValue: {
            $sum: {
              $multiply: ["$quantite", "$product_info.prix"]
            }
          }
        }
      }
    ]);
    const topItems = await Stock.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" },
      {
        $project: {
          name: "$product_info.libelle",
          sales: "$quantite",
          revenue: { $multiply: ["$quantite", "$product_info.prix"] },
          growth: { $literal: 0 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 4 }
    ]);

    const transactions = await Stock.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("product_id", "libelle prix");
    const salesTrendsData = [
      { month: 'Jan', ventes: 0, stocks: stockStats[0]?.totalQuantity || 0 },
      { month: 'Fév', ventes: 0, stocks: (stockStats[0]?.totalQuantity || 0) * 0.9 },
      { month: 'Mar', ventes: 0, stocks: (stockStats[0]?.totalQuantity || 0) * 1.1 }
    ];

    res.json({
      totalProducts,
      totalQuantity: stockStats[0]?.totalQuantity || 0,
      totalInventoryValue: stockStats[0]?.totalValue || 0,
      salesTrendsData,     
      categoryData,        
      stockByRegion,       
      regionalPerformance: stockByRegion.map(r => ({ region: r._id, ventes: r.total, objectif: 100 })), 
      topItems,            
      transactions: transactions.map(t => ({
        id: t._id,
        product: t.product_id.libelle,
        amount: t.quantite,
        status: 'success',
        date: new Date().toISOString().split('T')[0],
        region: t.region
      })),
      lowStockItems: await Stock.find({ quantite: { $lt: 5 } }).populate("product_id", "libelle prix")
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};