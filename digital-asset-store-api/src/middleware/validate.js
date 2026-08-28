const AppError = require("../utils/AppError");

/**
 * Higher-order middleware to run a validation function on req.body, req.params, or req.query.
 * @param {Function} validatorFn - Function accepting data and returning { valid: boolean, message?: string, errors?: string[] }
 * @param {'body' | 'params' | 'query'} [source='body'] - The property of req to validate
 */
function validate(validatorFn, source = "body") {
  return (req, res, next) => {
    const data = req[source];
    const result = validatorFn(data);

    if (!result.valid) {
      return next(
        new AppError(
          result.message || "Validation failed.",
          400,
          result.errors || [result.message],
        ),
      );
    }

    next();
  };
}

module.exports = validate;
