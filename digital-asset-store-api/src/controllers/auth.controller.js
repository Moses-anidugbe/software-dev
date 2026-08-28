const authService = require("../services/auth.service");

async function signup(req, res, next) {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: data.token,
      user: data.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
};
