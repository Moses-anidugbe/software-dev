const express = require("express");
const authRoutes = require("./auth.routes");
const productRoutes = require("./products.routes");
const purchaseRoutes = require("./purchases.routes");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/purchases", purchaseRoutes);

module.exports = router;
