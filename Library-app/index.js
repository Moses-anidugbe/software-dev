require("dotenv").config();

const express = require("express");
const client = require("./db");
const booksRouter = require("./routes/books");

const app = express();

app.use(express.json());

app.use("/books", booksRouter);

async function startServer() {
  try {
    await client.connect();

    console.log("✅ Connected to PostgreSQL");

    app.listen(process.env.PORT, () => {
      console.log("🚀 Server running at http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL.");
    console.error(error);

    process.exit(1);
  }
}

startServer();
