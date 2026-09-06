function validateCreateProduct(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Request body is required."] };
  }

  if (typeof data.title !== "string" || !data.title.trim()) {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (
    data.price === undefined ||
    data.price === null ||
    isNaN(Number(data.price)) ||
    Number(data.price) < 0
  ) {
    errors.push("Price is required and must be a non-negative number.");
  }

  if (typeof data.download_url !== "string" || !data.download_url.trim()) {
    errors.push("Download URL is required and must be a valid string.");
  }

  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? "Product validation failed." : undefined,
    errors,
  };
}

function validateProductIdParam(params) {
  const errors = [];
  const id = params ? params.id : undefined;

  if (
    !id ||
    isNaN(Number(id)) ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    errors.push("Product ID must be a valid positive integer.");
  }

  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? "Invalid product ID parameter." : undefined,
    errors,
  };
}

module.exports = {
  validateCreateProduct,
  validateProductIdParam,
};
