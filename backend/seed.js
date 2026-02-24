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
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    await User.create({
      email: "krakenamen@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });

    console.log("Admin created successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();