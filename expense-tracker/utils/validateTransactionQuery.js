function validateTransactionQuery(query) {
  const errors = [];
  const { type, category, month, year, sort, order, page, limit } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const allowedSortFields = ["transaction_date", "amount", "category", "type"];

  if (type && type !== "income" && type !== "expense") {
    errors.push("Type must be either 'income' or 'expense'.");
  }

  // validate category
  if (category && (typeof category !== "string" || category.trim() === "")) {
    errors.push("Category cannot be empty.");
  }

  // validate month
  const monthNumber = Number(month);
  if (
    month &&
    (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12)
  ) {
    errors.push("Month must be a number between 1 and 12.");
  }

  // validate year
  const yearNumber = Number(year);
  if (year && (!Number.isInteger(yearNumber) || yearNumber < 1)) {
    errors.push("Year must be a valid number.");
  }

  if (sort && !allowedSortFields.includes(sort)) {
    errors.push(
      `Sort field must be one of the following: ${allowedSortFields.join(", ")}.`,
    );
  }

  if (order && order !== "asc" && order !== "desc") {
    errors.push("Order must be either 'asc' or 'desc'.");
  }

  if (page !== undefined && (!Number.isInteger(pageNumber) || pageNumber < 1)) {
    errors.push("Page must be a positive integer.");
  }

  if (
    limit !== undefined &&
    (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100)
  ) {
    errors.push("Limit must be a positive integer between 1 and 100.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = validateTransactionQuery;
