const authService = require("../services/auth.service");

const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      // data: result,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
const me = (req, res) => {
  res.status(200).json({
    success: true,

    data: req.user,
  });
};

module.exports = {
  signup,

  login,
  me,
};
