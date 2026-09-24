const express = require("express");
const client = require("../db");
const authenticateToken = require("../middleware/authenticateToken");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({});
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const allowedFields = new Set(["title", "description"]);

  for (const key of Object.keys(req.body)) {
    if (!allowedFields.has(key)) {
      return res.status(400).json({
        message: `Invalid field: ${key}`,
      });
    }
  }
  const validation = validateTask(req.body, ["title"]);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const { title, description } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, req.user.id],
    );
    return res.status(201).json({
      message: "Task created successfully.",
      task: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/:id", authenticateToken, validateId, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await client.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.patch("/:id", authenticateToken, validateId, async (req, res) => {
  const id = Number(req.params.id);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "No fields provided.",
    });
  }
  const allowedFields = new Set(["title", "description", "completed"]);
  for (const key of Object.keys(req.body)) {
    if (!allowedFields.has(key)) {
      return res.status(400).json({
        message: `Invalid field: ${key}`,
      });
    }
  }

  const validation = validateTask(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  const updates = [];
  const values = [];

  if ("title" in req.body) {
    updates.push(`title = $${values.length + 1}`);
    values.push(req.body.title);
  }
  if ("description" in req.body) {
    updates.push(`description = $${values.length + 1}`);
    values.push(req.body.description);
  }
  if ("completed" in req.body) {
    updates.push(`completed = $${values.length + 1}`);
    values.push(req.body.completed);
  }

  values.push(id);

  const sql = `
    UPDATE tasks
    SET ${updates.join(", ")}
    WHERE id = $${values.length} AND user_id = $${values.length + 1}
    RETURNING *;
  `;

  try {
    const result = await client.query(sql, [...values, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.delete("/:id", authenticateToken, validateId, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await client.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
      task: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
