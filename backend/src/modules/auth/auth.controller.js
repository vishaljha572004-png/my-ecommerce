const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Registration ho gayi! Welcome 🎉",
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login ho gaya!",
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id);
    res.status(200).json({ success: true, message: "Logout ho gaya!" });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Refresh token do" });
    }
    const { accessToken, user } = await authService.refreshAccessToken(token);
    res.status(200).json({
      success: true,
      message: "Naya access token mil gaya",
      data: { accessToken, user },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};

module.exports = { register, login, logout, refreshToken, getMe };