const express = require("express");
const router = express.Router();
const client = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM purchases");
    res.json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching purchases:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
