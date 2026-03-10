const Stock = require("../models/Stock")

exports.getDashboard = async (req,res)=>{
  try{

    const totalProducts = await Stock.countDocuments()

    const totalStock = await Stock.aggregate([
      {
        $group:{
          _id:null,
          total:{ $sum:"$quantite" }
        }
      }
    ])

    const stockByRegion = await Stock.aggregate([
      {
        $group:{
          _id:"$region",
          total:{ $sum:"$quantite" }
        }
      }
    ])

    res.json({
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      stockByRegion
    })

  }catch(error){
    res.status(500).json({message:"Erreur serveur"})
  }
}