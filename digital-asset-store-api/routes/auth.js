const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db");
const validateUser = require("../utils/validateUser");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const validation = validateUser(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { email, password, role } = req.body;

  try {
    const existingUser = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING email, role`,
      [email, passwordHash, role],
    );

    res.status(201).json({
      message: "User created successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error occurred while checking user:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }
  try {
    const result = await client.query(
      `SELECT id, password_hash, role FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

module.exports = router;
