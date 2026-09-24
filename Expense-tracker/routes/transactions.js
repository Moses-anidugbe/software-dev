const express = require("express");
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");
const validateId = require("../middleware/validateId");
const validateTransaction = require("../utils/validateTransaction");
const validateTransactionQuery = require("../utils/validateTransactionQuery");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const validation = validateTransaction(req.body, [
    "amount",
    "type",
    "category",
    "transaction_date",
  ]);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }
  const { amount, type, category, description, transaction_date } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO transactions (amount, type, category, description, transaction_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [amount, type, category, description, transaction_date, req.user.id],
    );
    res.status(201).json({
      message: "Transaction created successfully.",
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  const validation = validateTransactionQuery(req.query);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }
  let sql = `
    SELECT *
    FROM transactions
    WHERE user_id = $1
  `;
  const sortColumn = req.query.sort || "transaction_date";
  const sortOrder = (req.query.order || "desc").toUpperCase();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const values = [req.user.id];
  if (req.query.type) {
    sql += ` AND type = $${values.length + 1}`;
    values.push(req.query.type);
  }
  if (req.query.category) {
    sql += ` AND category = $${values.length + 1}`;
    values.push(req.query.category);
  }
  if (req.query.month) {
    sql += ` AND EXTRACT(MONTH FROM transaction_date) = $${values.length + 1}`;
    values.push(Number(req.query.month));
  }
  if (req.query.year) {
    sql += ` AND EXTRACT(YEAR FROM transaction_date) = $${values.length + 1}`;
    values.push(Number(req.query.year));
  }
  sql += ` ORDER BY ${sortColumn} ${sortOrder}, id DESC`;
  values.push(limit);
  sql += ` LIMIT $${values.length}`;
  values.push(offset);
  sql += ` OFFSET $${values.length}`;
  try {
    const result = await client.query(sql, values);

    res.status(200).json({
      transactions: result.rows,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      `
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses
      FROM transactions
      WHERE user_id = $1;
      `,
      [req.user.id],
    );

    const summary = result.rows[0];

    res.status(200).json({
      totalIncome: summary.total_income,
      totalExpenses: summary.total_expenses,
      balance: Number(summary.total_income) - Number(summary.total_expenses),
    });
  } catch (error) {
    console.error("Error fetching summary:", error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/categories", authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      `
            SELECT
                category,
                SUM(amount) AS total
            FROM transactions
            WHERE user_id = $1
            AND type = 'expense'
            GROUP BY category
            ORDER BY total DESC;
            `,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/categories/percentages", authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      `
          SELECT
            category,
            SUM(amount) AS total
          FROM transactions
          WHERE user_id = $1
          AND type = 'expense'
          GROUP BY category
          ORDER BY total DESC;
        `,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    const totalExpenses = result.rows.reduce(
      (sum, row) => sum + Number(row.total),
      0,
    );

    const percentages = result.rows.map((row) => {
      const total = Number(row.total);
      return {
        category: row.category,
        total: total,
        percentage:
          totalExpenses > 0
            ? Number((total / totalExpenses) * 100).toFixed(2)
            : 0,
      };
    });

    res.json(percentages);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/monthly", authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      `
      SELECT
        EXTRACT(YEAR FROM transaction_date) AS year,
        EXTRACT(MONTH FROM transaction_date) AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses
      FROM transactions
      WHERE user_id = $1
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      `,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
});

router.get("/:id", authenticateToken, validateId, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await client.query(
      `
      SELECT *
      FROM transactions
      WHERE id = $1
      AND user_id = $2;
      `,
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.patch("/:id", authenticateToken, validateId, async (req, res) => {
  const id = req.params.id;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "No fields provided.",
    });
  }
  const allowedFields = new Set([
    "amount",
    "type",
    "category",
    "description",
    "transaction_date",
  ]);
  for (const key of Object.keys(req.body)) {
    if (!allowedFields.has(key)) {
      return res.status(400).json({
        message: `Invalid field: ${key}`,
      });
    }
  }

  const validation = validateTransaction(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (field in req.body) {
      updates.push(`${field} = $${values.length + 1}`);
      values.push(req.body[field]);
    }
  }

  values.push(id);
  values.push(req.user.id);

  const sql = `
    UPDATE transactions
    SET ${updates.join(", ")}
    WHERE id = $${values.length - 1} AND user_id = $${values.length}
    RETURNING *;
  `;
  try {
    const result = await client.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }
    res.status(200).json({
      message: "Transaction updated successfully.",
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.delete("/:id", authenticateToken, validateId, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await client.query(
      `
      DELETE FROM transactions
      WHERE id = $1
      AND user_id = $2
      RETURNING *;
      `,
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully.",
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
