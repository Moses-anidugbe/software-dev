function validateBook(book, requiredFields = []) {
  const errors = [];

  if (!book || typeof book !== "object") {
    return {
      valid: false,
      errors: ["Invalid book data provided."],
    };
  }

  const currentYear = new Date().getFullYear();

  // ---------- Title ----------
  const titleRequired = requiredFields.includes("title");

  if (titleRequired && book.title === undefined) {
    errors.push("Title is required.");
  } else if (
    book.title !== undefined &&
    (typeof book.title !== "string" || book.title === "")
  ) {
    errors.push("Title must be a non-empty string.");
  }

  // ---------- Author ----------
  const authorRequired = requiredFields.includes("author");

  if (authorRequired && book.author === undefined) {
    errors.push("Author is required.");
  } else if (
    book.author !== undefined &&
    (typeof book.author !== "string" || book.author === "")
  ) {
    errors.push("Author must be a non-empty string.");
  }

  // ---------- Published Year ----------
  const yearRequired = requiredFields.includes("published_year");

  if (yearRequired && book.published_year === undefined) {
    errors.push("Published year is required.");
  } else if (
    book.published_year !== undefined &&
    (typeof book.published_year !== "number" ||
      Number.isNaN(book.published_year) ||
      book.published_year < 0 ||
      book.published_year > currentYear)
  ) {
    errors.push(
      `Published year must be a number between 0 and ${currentYear}.`,
    );
  }

  // ---------- Available ----------
  const availableRequired = requiredFields.includes("available");

  if (availableRequired && book.available === undefined) {
    errors.push("Available is required.");
  } else if (
    book.available !== undefined &&
    typeof book.available !== "boolean"
  ) {
    errors.push("Available must be a boolean.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = validateBook;
