const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const config = require("../config/env");
const AppError = require("../utils/AppError");

async function signup({ email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await db.query("SELECT id FROM users WHERE email = $1", [
    normalizedEmail,
  ]);

  if (existingUser.rows.length > 0) {
    throw new AppError("User already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.query(
    "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
    [normalizedEmail, passwordHash, role],
  );

  return result.rows[0];
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await db.query(
    "SELECT id, email, password_hash, role FROM users WHERE email = $1",
    [normalizedEmail],
  );

  if (result.rows.length === 0) {
    throw new AppError("Invalid email or password.", 401);
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = {
  signup,
  login,
};
