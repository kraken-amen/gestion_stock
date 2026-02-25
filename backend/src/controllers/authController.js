const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// --- CREATE USER : Création d'un compte par l'administrateur (US2) ---
exports.createUserByAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Vérifier si l'utilisateur existe déjà dans la base de données
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // 2. Hasher le mot de passe initial avec bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Créer l'utilisateur avec le statut non vérifié par défaut
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      isVerified: false 
    });

    res.status(201).json({ message: "Utilisateur créé avec succès par l'Admin", data: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN : Vérification des identifiants et génération du code OTP (US1) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier l'existence de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // 2. Vérifier si le compte est actif
    if (!user.isActive) {
   return res.status(403).json({ message: "Votre compte est désactivé. Contactez l'admin." });
}
    // 3. Comparer le mot de passe saisi avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Générer un code de vérification aléatoire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Stocker le code et définir l'expiration (10 minutes)
    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 6. Envoyer le code de sécurité par email
    try {
      await sendEmail({
        email: user.email,
        subject: "Votre Code de Connexion - Système de Stock",
        message: `Votre code de vérification est : ${code}`
      });

      return res.status(200).json({
        message: "Code envoyé. Veuillez vérifier votre boîte mail.",
        step: "verification_required"
      });
    } catch (mailError) {
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- VERIFY CODE : Validation finale et génération du Token JWT ---
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    // 1. Valider le code et vérifier s'il n'est pas expiré
    if (
      !user ||
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Code invalide ou expiré" });
    }

    // 2. Marquer l'utilisateur comme vérifié et nettoyer le code OTP
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // 3. Générer le Token JWT pour la session
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Authentification réussie",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//  Modification User (Update)
exports.updateUser = async (req, res) => {
  try {
    const { email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { email, role, isActive }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Désactivation User
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `Statut changé: ${user.isActive ? 'Activé' : 'Désactivé'}` });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};
// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};
// get available roles for front
exports.getAvailableRoles = async (req, res) => {
    try {
        const roles = ["admin", "responsable_region", "user"]; 
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rôles" });
    }
};