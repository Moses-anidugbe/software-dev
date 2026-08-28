const express = require("express");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

// Body parser
app.use(express.json());

// Mount API routes
app.use("/api", routes);

// Handle 404 for undefined routes
app.use((req, res, next) => {
  next(
    new AppError(
      `Cannot ${req.method} ${req.originalUrl} - Route not found`,
      404,
    ),
  );
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
