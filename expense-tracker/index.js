const express = require("express");
const dotenv = require("dotenv");
const client = require("./db");
const authRouter = require("./routes/auth");
const transactionsRouter = require("./routes/transactions");
const authenticateToken = require("./middleware/authenticateToken");

dotenv.config();
const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/transactions", authenticateToken, transactionsRouter);

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL.");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }
}

startServer();
