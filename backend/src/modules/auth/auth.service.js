const User = require("../../models/User.model");
const AppError = require("../../common/errors/AppError");
const jwt = require("jsonwebtoken");
const { cacheClient } = require("../../config/redis");
const env = require("../../config/env");

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  const key = `refresh:${userId}`;
  const ttl = 7 * 24 * 60 * 60;
  await cacheClient.setex(key, ttl, refreshToken);
};

const register = async ({ firstName, lastName, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Yeh email already registered hai", 409);
  }

  const user = await User.create({ firstName, lastName, email, password, phone });
  const { accessToken, refreshToken } = generateTokens(user._id);
  await saveRefreshToken(user._id, refreshToken);

  return { user, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Email ya password galat hai", 401);
  if (!user.isActive) throw new AppError("Aapka account band kar diya gaya hai", 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Email ya password galat hai", 401);

  const { accessToken, refreshToken } = generateTokens(user._id);
  await saveRefreshToken(user._id, refreshToken);

  return { user, accessToken, refreshToken };
};

const logout = async (userId) => {
  await cacheClient.del(`refresh:${userId}`);
};

const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid ya expired refresh token", 401);
  }

  const storedToken = await cacheClient.get(`refresh:${decoded.id}`);
  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError("Refresh token valid nahi hai", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new AppError("User nahi mila", 401);

  const accessToken = jwt.sign(
    { id: user._id },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );

  return { accessToken, user };
};

module.exports = { register, login, logout, refreshAccessToken };