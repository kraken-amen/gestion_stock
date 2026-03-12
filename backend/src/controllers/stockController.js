const Stock = require('../models/Stock')

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('product_id');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}
exports.createStock = async (req, res) => {
  try {
    const { product_id, region } = req.body;
    const exists = await Stock.findOne({ product_id, region });
    if (exists) return res.status(400).json({ message: "Le produit existe déjà dans cette région" });

    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.updateStock = async (req, res) => {
  try {
    const { product_id,quantite ,region} = req.body;
    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      { product_id,quantite ,region},
      { new: true, runValidators: true }
    );
    if (!stock) return res.status(404).json({ message: "Stock non trouvé" });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock non trouvé" });
    res.json({ message: "Stock supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

exports.registerStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      { enregisted: true },
      { new: true, runValidators: true }
    );
    if (!stock) return res.status(404).json({ message: "Stock non trouvé" });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}