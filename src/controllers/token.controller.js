const authService = require("../services/auth.service");

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const result = await authService.refreshAccessToken(token);

    res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  refreshToken,
};