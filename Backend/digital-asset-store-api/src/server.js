const app = require("./app");
const db = require("./config/db");
const config = require("./config/env");

let server;

async function startServer() {
  try {
    // Verify database connection readiness
    await db.testConnection();
    console.log("Connected to PostgreSQL pool.");

    server = app.listen(config.PORT, () => {
      console.log(
        `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`,
      );
    });
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");
      await db.pool.end();
      console.log("Database pool closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

// Unhandled rejection / uncaught exception safety
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...", err);
  process.exit(1);
});

startServer();
