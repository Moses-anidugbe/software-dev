const AppError = require("../utils/AppError");

function requireRole(...roles) {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access denied. Insufficient permissions.", 403),
      );
    }
    next();
  };
}

module.exports = requireRole;
