function validateUser(user) {
  const errors = [];
  if (!user) {
    return {
      valid: false,
      errors: ["User is required"],
    };
  }

  // Username validation
  if (typeof user.username !== "string" || user.username.trim() === "") {
    errors.push("Username is required and must be a non-empty string");
  }

  // Email validation
  if (typeof user.email !== "string") {
    errors.push("Email is required and must be a valid email address");
  } else {
    const email = user.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push("Email is required and must be a valid email address");
    }
  }

  // Password validation
  if (typeof user.password !== "string" || user.password.trim() === "") {
    errors.push("Password is required and must be a non-empty string");
  } else if (user.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
module.exports = validateUser;
