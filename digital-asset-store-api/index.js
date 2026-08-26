const express = require("express");
const dotenv = require("dotenv");
const client = require("./db");
const productRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const purchaseRouter = require("./routes/purchases");

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/purchases", purchaseRouter);

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
