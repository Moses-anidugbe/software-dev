const config = require("../config/env");

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error.";
  let errors = err.errors || undefined;

  // Handle PostgreSQL specific errors
  if (err.code === "23505") {
    // Unique violation
    statusCode = 409;
    message = "Resource already exists with the provided unique field.";
  } else if (err.code === "23503") {
    // Foreign key violation
    statusCode = 400;
    message = "Referenced resource does not exist.";
  } else if (err.code === "22P02") {
    // Invalid text representation (e.g. string passed instead of integer id)
    statusCode = 400;
    message = "Invalid input syntax for parameter.";
  }

  if (config.NODE_ENV !== "test" && statusCode === 500) {
    console.error("Unhandled Application Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
