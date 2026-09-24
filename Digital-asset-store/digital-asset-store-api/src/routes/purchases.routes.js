const express = require("express");
const purchasesController = require("../controllers/purchases.controller");
const authenticateToken = require("../middleware/authenticateToken");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const { validateProductIdParam } = require("../validators/product.validator");

const router = express.Router();

// Get current buyer's purchase history
router.get(
  "/",
  authenticateToken,
  requireRole("buyer"),
  purchasesController.getPurchases,
);

// Alternate direct purchase endpoint
router.post(
  "/:id",
  authenticateToken,
  requireRole("buyer"),
  validate(validateProductIdParam, "params"),
  purchasesController.purchaseProduct,
);

module.exports = router;
