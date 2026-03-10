const Stock = require('../models/Stock')

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find()
    res.json(stocks)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.createStock = async (req, res) => {
  try {

    const stock = new Stock(req.body)

    await stock.save()

    res.status(201).json(stock)

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" })
  }
}
exports.updateStock = async (req,res)=>{
  try{

    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:true }
    )

    res.json(stock)

  }catch(error){
    res.status(500).json({message:"Erreur serveur"})
  }
}
exports.deleteStock = async (req,res)=>{
  try{

    await Stock.findByIdAndDelete(req.params.id)

    res.json({message:"Stock supprimé"})

  }catch(error){
    res.status(500).json({message:"Erreur serveur"})
  }
}