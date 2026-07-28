function validateTask(Task, requiredFields = []) {
  const errors = [];

  // ---------- Title ----------
  if (requiredFields.includes("title") && Task.title === undefined) {
    errors.push("Title is required.");
  } else if (
    Task.title !== undefined &&
    (typeof Task.title !== "string" || Task.title === "")
  ) {
    errors.push("Title must be a non-empty string.");
  }

  // ---------- Description ----------
  if (
    requiredFields.includes("description") &&
    Task.description === undefined
  ) {
    errors.push("Description is required.");
  } else if (
    Task.description !== undefined &&
    (typeof Task.description !== "string" || Task.description === "")
  ) {
    errors.push("Description must be a non-empty string.");
  }

  // ---------- Completed ----------
  if (requiredFields.includes("completed") && Task.completed === undefined) {
    errors.push("Completed is required.");
  } else if (
    Task.completed !== undefined &&
    typeof Task.completed !== "boolean"
  ) {
    errors.push("Completed must be a boolean.");
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

module.exports = validateTask;
