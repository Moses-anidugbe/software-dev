require("dotenv").config();

const express = require("express");
const { Client } = require("pg");

const app = express();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Sneaker Store API",
    endpoints: ["GET /sneakers", "GET /sneakers/:id", "POST /sneakers"],
  });
});

// Get all sneakers
app.get("/sneakers", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM sneakers");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Get sneaker by ID
app.get("/sneakers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "ID must be a number.",
      });
    }

    const result = await client.query("SELECT * FROM sneakers WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Sneaker not found.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Create a new sneaker
app.post("/sneakers", async (req, res) => {
  const sneaker = {
    ...req.body,
    name: req.body.name?.trim(),
  };

  // Validation
  if (typeof sneaker.name !== "string" || sneaker.name === "") {
    return res.status(400).json({
      message: "Name is required.",
    });
  }

  if (typeof sneaker.price !== "number") {
    return res.status(400).json({
      message: "Price must be a number.",
    });
  }

  if (sneaker.price <= 0) {
    return res.status(400).json({
      message: "Price must be greater than zero.",
    });
  }

  try {
    const result = await client.query(
      "INSERT INTO sneakers (name, price) VALUES ($1, $2) RETURNING *",
      [sneaker.name, sneaker.price],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

async function startServer() {
  try {
    await client.connect();

    console.log("✅ Connected to PostgreSQL");

    app.listen(3000, () => {
      console.log("🚀 Server running at http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL.");
    console.error(error);

    process.exit(1);
  }
}

startServer();
