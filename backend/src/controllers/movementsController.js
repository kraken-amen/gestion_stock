const Movement = require('../models/Movements');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
exports.getMovements = async (req, res) => {
  try {
    let filter = {};

    if (req.user && req.user.role === "responsable region") {
    }

    const history = await Movement.find(filter)
      .populate("product_id", "libelle codeArticle")
      .populate("from", "email")
      .populate("to", "email")
      .sort({ dateMovement: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductHistory = async (req, res) => {
  try {
    const { product_id } = req.params;
    const history = await Movement.find({ product_id })
      .populate('from', 'email')
      .populate('to', 'email')
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};