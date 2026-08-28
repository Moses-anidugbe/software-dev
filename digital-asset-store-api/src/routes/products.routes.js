const express = require("express");
const productsController = require("../controllers/products.controller");
const purchasesController = require("../controllers/purchases.controller");
const authenticateToken = require("../middleware/authenticateToken");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const {
  validateCreateProduct,
  validateProductIdParam,
} = require("../validators/product.validator");

const router = express.Router();

// Public routes
router.get("/", productsController.getAllProducts);
router.get(
  "/:id",
  validate(validateProductIdParam, "params"),
  productsController.getProductById,
);

// Seller routes
router.post(
  "/",
  authenticateToken,
  requireRole("seller"),
  validate(validateCreateProduct),
  productsController.createProduct,
);

// Buyer product purchasing routes (supports both :id/buy and :id/purchase)
router.post(
  "/:id/buy",
  authenticateToken,
  requireRole("buyer"),
  validate(validateProductIdParam, "params"),
  purchasesController.purchaseProduct,
);

router.post(
  "/:id/purchase",
  authenticateToken,
  requireRole("buyer"),
  validate(validateProductIdParam, "params"),
  purchasesController.purchaseProduct,
);

module.exports = router;
