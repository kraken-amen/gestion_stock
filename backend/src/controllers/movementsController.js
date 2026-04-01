const Movement = require('../models/Movements');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.handleMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { product_id, quantite, type } = req.body;

    // 1. التثبت من نوع الحركة (ENTREE أو SORTIE فقط)
    if (!["ENTREE", "SORTIE"].includes(type)) {
      throw new Error("Type de mouvement invalide (ENTREE ou SORTIE uniquement)");
    }

    const qty = Number(quantite);
    if (isNaN(qty) || qty <= 0) {
      throw new Error("La quantité doit être un nombre positif");
    }

    // 2. التثبت من وجود المنتج في المخزن المركزي
    const product = await Product.findById(product_id).session(session);
    if (!product) {
      throw new Error("Produit non trouvé dans le stock central");
    }

    // 3. تطبيق المنطق (ENTREE يزيد و SORTIE ينقص)
    if (type === "ENTREE") {
      // حالة إضافة سلعة جديدة للمخزن (مثلاً شرينا سلعة جديدة)
      product.quantite += qty;
    } 
    else if (type === "SORTIE") {
      // حالة إخراج سلعة (مثلاً ضياع، تكسير، أو تحويل يدوي)
      if (product.quantite < qty) {
        throw new Error(`Stock insuffisant. Disponible: ${product.quantite}`);
      }
      product.quantite -= qty;
    }

    // حفظ التغييرات في جدول الـ Product
    await product.save({ session });

    // 4. تسجيل العملية في جدول الـ Movement للـ Historique
    const movement = await Movement.create([{
      product_id: product._id,
      user_id: req.user._id, // شكون الـ Admin اللي عمل العملية
      quantite: qty,
      type: type,
      description: description || (type === "ENTREE" ? "Ajout de stock" : "Sortie de stock"),
      dateMovement: Date.now()
    }], { session });

    await session.commitTransaction();
    res.status(200).json({
      message: `Mouvement ${type} effectué avec succès`,
      newStock: product.quantite,
      movement: movement[0]
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// تابع للـ Admin باش يشوف التاريخ الكامل للسلعة
exports.getProductHistory = async (req, res) => {
  try {
    const { product_id } = req.params;
    const history = await Movement.find({ product_id })
      .populate('user_id', 'email')
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};