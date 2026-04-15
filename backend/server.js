const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/authRoutes");
const stockRoutes = require("./src/routes/stockRoute");
const productRoutes = require("./src/routes/productRoutes");
const moveRoutes = require("./src/routes/moveRoute");
const demandeRoutes = require("./src/routes/demandeRoutes");
const confirmationRoutes = require("./src/routes/confirmationRoutes");
const commandeRoutes = require("./src/routes/commandeRoutes");
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error :", err));

// Root Route
app.get("/", (req, res) => {
  res.send("API is running ");
});

// Routes Registration
app.use("/api/auth", authRoutes);
// Stock Routes
app.use("/api/stock", stockRoutes);
// Product Routes
app.use("/api/product", productRoutes);
// Movement Routes
app.use("/api/movement", moveRoutes);
// Demande Routes
app.use("/api/demande", demandeRoutes);
// Confirmation Routes
app.use("/api/confirmation", confirmationRoutes);
// Commande Routes
app.use("/api/commande", commandeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});