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
    const lowStockItems = await Stock.find({ quantite: { $lt: 5 } })
      .populate("product_id", "libelle prix");

    res.json({
      totalProducts,
      totalQuantity: stockStats[0]?.totalQuantity || 0,
      totalInventoryValue: stockStats[0]?.totalValue || 0,
      stockByRegion,
      lowStockItems
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};