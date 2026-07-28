const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const [type, token] = authHeader ? authHeader.split(" ") : [];

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Access token required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authenticateToken;
