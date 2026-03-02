const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./src/models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "administrateur" });

    if (adminExists) {
      console.log("Administrateur already exists");
      process.exit();
    }
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "administrateur",
      isVerified: true
    });

    console.log("Administrateur created successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();