function validateTransaction(transaction, requiredFields = []) {
  const { amount, type, description, transaction_date, category } = transaction;
  const errors = [];

  if (
    requiredFields.includes("amount") &&
    (typeof amount !== "number" || amount <= 0)
  ) {
    errors.push("Amount must be a positive number.");
  }

  if (
    requiredFields.includes("type") &&
    type !== "income" &&
    type !== "expense"
  ) {
    errors.push("Type is required and must be either 'income' or 'expense'.");
  }

  if (
    requiredFields.includes("description") &&
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    errors.push("Description must be a string.");
  }

  if (
    requiredFields.includes("transaction_date") &&
    (typeof transaction_date !== "string" || isNaN(new Date(transaction_date)))
  ) {
    errors.push("Transaction date is required and must be a valid date.");
  }

  if (
    requiredFields.includes("category") &&
    (typeof category !== "string" || category.trim() === "")
  ) {
    errors.push("Category is required and must be a non-empty string.");
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

module.exports = validateTransaction;
