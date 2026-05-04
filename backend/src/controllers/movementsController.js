const Movement = require('../models/Movements');
exports.getMovements = async (req, res) => {
  try {
    let filter = {};

    if (req.user && req.user.role === "responsable region") {
    }

    const history = await Movement.find(filter)
      .populate("product_id", "libelle codeArticle")
      .populate("from", "email")
      .populate("to", "email")
      .populate("region")
      .sort({ dateMovement: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};