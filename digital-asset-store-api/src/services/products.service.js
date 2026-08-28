const db = require("../config/db");
const AppError = require("../utils/AppError");

async function createProduct({ title, price, download_url, sellerId }) {
  const result = await db.query(
    "INSERT INTO products (title, price, download_url, seller_id) VALUES ($1, $2, $3, $4) RETURNING id, seller_id, title, price, download_url",
    [title.trim(), parseFloat(price), download_url.trim(), sellerId],
  );

  return result.rows[0];
}

async function getAllProducts() {
  const result = await db.query(
    "SELECT id, seller_id, title, price FROM products ORDER BY id ASC",
  );
  return result.rows;
}

async function getProductById(id) {
  const result = await db.query(
    "SELECT id, seller_id, title, price FROM products WHERE id = $1",
    [id],
  );

  if (result.rows.length === 0) {
    throw new AppError("Product not found.", 404);
  }

  return result.rows[0];
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};
