const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Créer un transporteur (Le serveur qui envoie)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // 2. Définir les options de l'email
  const mailOptions = {
    from: `"Système de Stock" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Envoyer l'email réellement
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;