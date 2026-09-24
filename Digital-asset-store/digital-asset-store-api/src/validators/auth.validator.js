const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateSignup(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Request body is required."] };
  }

  // Email validation
  if (typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email is required.");
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push("Email must be a valid email address.");
  }

  // Password validation
  if (typeof data.password !== "string" || !data.password.trim()) {
    errors.push("Password is required.");
  } else if (data.password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  // Role validation
  if (
    typeof data.role !== "string" ||
    !["buyer", "seller"].includes(data.role.trim())
  ) {
    errors.push("Role is required and must be either 'buyer' or 'seller'.");
  }

  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? "Validation failed." : undefined,
    errors,
  };
}

function validateLogin(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Request body is required."] };
  }

  if (typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email is required.");
  }

  if (typeof data.password !== "string" || !data.password.trim()) {
    errors.push("Password is required.");
  }

  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? "Validation failed." : undefined,
    errors,
  };
}

module.exports = {
  validateSignup,
  validateLogin,
};
