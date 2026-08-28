const jwt = require("jsonwebtoken");
const config = require("../config/env");
const AppError = require("../utils/AppError");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const [type, token] = authHeader ? authHeader.split(" ") : [];

  if (type !== "Bearer" || !token) {
    return next(new AppError("Access token required.", 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token.", 401));
  }
}

module.exports = authenticateToken;
