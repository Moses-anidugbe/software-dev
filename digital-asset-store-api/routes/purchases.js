const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/", authenticateToken, requireRole("buyer"), async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM purchases WHERE buyer_id = $1",
      [req.user.id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching purchases:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
