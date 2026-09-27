import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Online Store API is running" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
