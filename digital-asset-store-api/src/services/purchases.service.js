const db = require("../config/db");
const AppError = require("../utils/AppError");

async function purchaseProduct({ buyerId, productId }) {
  // Check if product exists
  const productResult = await db.query(
    "SELECT id, seller_id, title, price, download_url FROM products WHERE id = $1",
    [productId],
  );

  if (productResult.rows.length === 0) {
    throw new AppError("Product not found.", 404);
  }

  const product = productResult.rows[0];

  if (product.seller_id === buyerId) {
    throw new AppError("Sellers cannot purchase their own products.", 400);
  }

  // Check if product is already purchased by this buyer
  const existingPurchase = await db.query(
    "SELECT id FROM purchases WHERE buyer_id = $1 AND product_id = $2",
    [buyerId, productId],
  );

  if (existingPurchase.rows.length > 0) {
    throw new AppError("You have already purchased this product.", 409);
  }

  const purchaseResult = await db.query(
    "INSERT INTO purchases (buyer_id, product_id) VALUES ($1, $2) RETURNING id, buyer_id, product_id, purchased_at",
    [buyerId, productId],
  );

  return {
    purchase: purchaseResult.rows[0],
    product: {
      id: product.id,
      title: product.title,
      download_url: product.download_url,
    },
  };
}

async function getPurchasesByBuyerId(buyerId) {
  const result = await db.query(
    `SELECT 
       p.id AS purchase_id,
       p.purchased_at,
       pr.id AS product_id,
       pr.title,
       pr.price,
       pr.download_url
     FROM purchases p
     JOIN products pr ON p.product_id = pr.id
     WHERE p.buyer_id = $1
     ORDER BY p.purchased_at DESC`,
    [buyerId],
  );

  return result.rows;
}

module.exports = {
  purchaseProduct,
  getPurchasesByBuyerId,
};
