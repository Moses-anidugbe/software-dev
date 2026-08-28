const express = require("express");
const router = express.Router();
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");
const requireRole = require("../middleware/requireRole");

router.post("/", authenticateToken, requireRole("seller"), async (req, res) => {
  //Validate request body
  const validation = validateProduct(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  const { title, price, download_url } = req.body;

  // Process the request (e.g., save to database)
  try {
    const result = await client.query(
      `INSERT INTO products (title, price, download_url, seller_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, price, download_url, req.user.id],
    );

    res.status(201).json({
      message: "Product created successfully.",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error occurred while creating product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, seller_id, title, price FROM products",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching products:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post(
  "/:id/buy",
  authenticateToken,
  requireRole("buyer"),
  async (req, res) => {
    const { id } = req.params;
    // Process the request
    try {
      const product = await client.query(
        "SELECT id FROM products WHERE id = $1",
        [id],
      );

      if (product.rows.length === 0) {
        return res.status(404).json({ message: "Product not found." });
      }

      const result = await client.query(
        "INSERT INTO purchases (buyer_id, product_id) VALUES ($1, $2) RETURNING *",
        [req.user.id, id],
      );

      res
        .status(200)
        .json({ message: `Product with ID ${id} purchased successfully.` });
    } catch (error) {
      console.error("Error occurred while purchasing product:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
);

module.exports = router;
