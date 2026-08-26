const express = require("express");
const router = express.Router();
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");
const requireRole = require("../middleware/requireRole");

router.post("/", authenticateToken, requireRole("seller"), async (req, res) => {
  const { title, price, download_url } = req.body;

  // Process the request (e.g., save to database)
  try {
    const result = await client.query(
      `INSERT INTO products (title, price, download_url, seller_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, price, download_url, req.user.id],
    );

    const createdProduct = result.rows[0];

    res.status(201).json({
      message: "Product created successfully.",
      title: createdProduct.title,
      price: createdProduct.price,
      download_url: createdProduct.download_url,
      seller_id: createdProduct.seller_id,
    });
  } catch (error) {
    console.error("Error occurred while creating product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM products");
    res.json(result.rows);
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
      const result = await client.query(
        "UPDATE products SET inventory = inventory - 1 WHERE id = $1 RETURNING *",
        [id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.json({ message: `Product with ID ${id} purchased successfully.` });
    } catch (error) {
      console.error("Error occurred while purchasing product:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },
);

module.exports = router;
