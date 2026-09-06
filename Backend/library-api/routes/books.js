const express = require("express");
const client = require("../db");
const validateBook = require("../utils/validateBook");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM books");

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/:id", validateId, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await client.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Insert a new book
router.post("/", async (req, res) => {
  const book = {
    title:
      typeof req.body.title === "string"
        ? req.body.title.trim()
        : req.body.title,

    author:
      typeof req.body.author === "string"
        ? req.body.author.trim()
        : req.body.author,

    published_year: req.body.published_year,
    available: req.body.available,
  };

  // Validation
  const validation = validateBook(book, ["title", "author", "published_year"]);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  //Query
  try {
    let result;

    if (book.available === undefined) {
      result = await client.query(
        `INSERT INTO books (title, author, published_year)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [book.title, book.author, book.published_year],
      );
    } else {
      result = await client.query(
        `INSERT INTO books (title, author, published_year, available)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [book.title, book.author, book.published_year, book.available],
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Update a book
router.put("/:id", validateId, async (req, res) => {
  const id = req.params.id;

  // Whitelist accepted fields
  const book = {
    title:
      typeof req.body.title === "string"
        ? req.body.title.trim()
        : req.body.title,

    author:
      typeof req.body.author === "string"
        ? req.body.author.trim()
        : req.body.author,

    published_year: req.body.published_year,
    available: req.body.available,
  };

  // Validate all required fields
  const validation = validateBook(book, [
    "title",
    "author",
    "published_year",
    "available",
  ]);

  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.errors,
    });
  }

  try {
    const result = await client.query(
      `UPDATE books
       SET title = $1,
           author = $2,
           published_year = $3,
           available = $4
       WHERE id = $5
       RETURNING *;`,
      [book.title, book.author, book.published_year, book.available, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.patch("/:id", validateId, async (req, res) => {
  const id = req.params.id;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body cannot be empty.",
    });
  }

  const book = {
    title:
      typeof req.body.title === "string"
        ? req.body.title.trim()
        : req.body.title,

    author:
      typeof req.body.author === "string"
        ? req.body.author.trim()
        : req.body.author,

    published_year: req.body.published_year,
    available: req.body.available,
  };

  const validation = validateBook(book);

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
    values.push(book.title);
  }

  if ("author" in req.body) {
    updates.push(`author = $${values.length + 1}`);
    values.push(book.author);
  }

  if ("published_year" in req.body) {
    updates.push(`published_year = $${values.length + 1}`);
    values.push(book.published_year);
  }

  if ("available" in req.body) {
    updates.push(`available = $${values.length + 1}`);
    values.push(book.available);
  }

  values.push(id);

  const sql = `
    UPDATE books
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await client.query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  const id = req.params.id;

  try {
    const result = await client.query(
      `DELETE FROM books
       WHERE id = $1
       RETURNING *;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      message: "Book deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

module.exports = router;
