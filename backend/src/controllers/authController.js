const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// --- CREATE USER : Création d'un compte par l'administrateur (US2) ---
exports.createUserByAdmin = async (req, res) => {
  try {
    const { email, password, role, region } = req.body;

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
      region: role === "responsable region" ? region : null,
      isVerified: false
    });

    res.status(201).json({ message: "Utilisateur créé avec succès par l'Administrateur", data: newUser });
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
        message: `Votre code de vérification est : ${code}. Il expire dans 10 minutes.`
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

// Fonction pour renvoyer un nouveau code OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 2. Vérifier si le compte est actif avant d'envoyer quoi que ce soit
    if (!user.isActive) {
      return res.status(403).json({ message: "Compte désactivé" });
    }

    // 3. Générer un nouveau code de 6 chiffres
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Mettre à jour le code et l'expiration (1 minute comme demandé)
    user.verificationCode = newCode;
    user.verificationCodeExpires = Date.now() + 60 * 1000; // 1 minute
    await user.save();

    // 5. Renvoyer l'email avec le nouveau code
    try {
      await sendEmail({
        email: user.email,
        subject: "Nouveau Code de Vérification",
        message: `Votre nouveau code de vérification est : ${newCode}. Il expire dans 10 minutes.`
      });

      return res.status(200).json({
        message: "Un nouveau code a été envoyé à votre adresse email."
      });
    } catch (mailError) {
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors du renvoi de l'OTP" });
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
      id: user._id,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//  Modification User (Update)
exports.updateUser = async (req, res) => {
  try {
    const { email, role, password, region } = req.body;
    let updateData = {};
    if (email) updateData.email = email;
    if (role) {
      updateData.role = role;
      if (role === "responsable region") {
        if (!region) {
          return res.status(400).json({ message: "Region est obligatoire pour responsable region" });
        }
        updateData.region = region;
      } else {
        updateData.$unset = { region: 1 }; 
      }
    }
    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true, 
        context: 'query'
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès", user });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }
    res.status(500).json({ message: "Erreur update: " + error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    if (req.user.id === userIdToDelete) {
      return res.status(400).json({ message: "Action interdite : tu ne peux pas supprimer ton propre compte" });
    }
    const user = await User.findByIdAndDelete(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression : " + error.message });
  }
};
// Désactivation User
exports.toggleUserStatus = async (req, res) => {
  try {
    const userIdToToggle = req.params.id; 
    const user = await User.findById(userIdToToggle);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({ message: "Tu ne peux pas désactiver ton propre compte" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ 
      message: `Statut changé: ${user.isActive ? 'Activé' : 'Désactivé'}`,
      isActive: user.isActive 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la désactivation: " + error.message });
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