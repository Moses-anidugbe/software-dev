const { describe, it, after } = require("node:test");
const assert = require("node:assert/strict");

const {
  validateSignup,
  validateLogin,
} = require("../src/validators/auth.validator");
const {
  validateCreateProduct,
  validateProductIdParam,
} = require("../src/validators/product.validator");
const AppError = require("../src/utils/AppError");
const db = require("../src/config/db");

describe("Auth Validators", () => {
  it("should fail signup if email is invalid", () => {
    const result = validateSignup({
      email: "invalid-email",
      password: "password123",
      role: "buyer",
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("valid email")));
  });

  it("should fail signup if password is under 8 characters", () => {
    const result = validateSignup({
      email: "test@example.com",
      password: "short",
      role: "buyer",
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("8 characters")));
  });

  it("should fail signup if role is invalid", () => {
    const result = validateSignup({
      email: "test@example.com",
      password: "password123",
      role: "admin",
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("Role is required")));
  });

  it("should pass signup with valid credentials", () => {
    const result = validateSignup({
      email: "buyer@example.com",
      password: "validPassword123",
      role: "buyer",
    });
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it("should validate login requirements", () => {
    const invalid = validateLogin({});
    assert.equal(invalid.valid, false);

    const valid = validateLogin({
      email: "buyer@example.com",
      password: "password123",
    });
    assert.equal(valid.valid, true);
  });
});

describe("Product Validators", () => {
  it("should fail if product title is missing", () => {
    const result = validateCreateProduct({
      price: 19.99,
      download_url: "https://example.com/asset.zip",
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("Title is required")));
  });

  it("should fail if price is negative", () => {
    const result = validateCreateProduct({
      title: "Asset Pack",
      price: -5,
      download_url: "https://example.com/asset.zip",
    });
    assert.equal(result.valid, false);
  });

  it("should pass with valid product payload", () => {
    const result = validateCreateProduct({
      title: "3D UI Kit",
      price: 29.99,
      download_url: "https://storage.example.com/files/kit.zip",
    });
    assert.equal(result.valid, true);
  });

  it("should validate product ID params", () => {
    assert.equal(validateProductIdParam({ id: "abc" }).valid, false);
    assert.equal(validateProductIdParam({ id: "-1" }).valid, false);
    assert.equal(validateProductIdParam({ id: "42" }).valid, true);
  });
});

describe("AppError Utility", () => {
  it("should correctly set status code and operational flag", () => {
    const error = new AppError("Forbidden action", 403);
    assert.equal(error.statusCode, 403);
    assert.equal(error.status, "fail");
    assert.equal(error.isOperational, true);
    assert.equal(error.message, "Forbidden action");
  });
});

describe("Express App Configuration", () => {
  it("should export an initialized Express app instance", () => {
    const app = require("../src/app");
    assert.ok(typeof app.handle === "function");
  });

  after(async () => {
    await db.pool.end();
  });
});
