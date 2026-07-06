const User = require("../../models/User.model");
const AppError = require("../../common/errors/AppError");

// ── Get user profile ─────────────────────────────────────────────
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ── Update user profile ──────────────────────────────────────────
const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,        // return updated document
      runValidators: true,
    }
  );
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ── Add new address ──────────────────────────────────────────────
const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // If this is the first address or isDefault is true,
  // remove default from all other addresses
  if (addressData.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();
  return user;
};

// ── Update existing address ──────────────────────────────────────
const updateAddress = async (userId, addressId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  // If setting this as default, unset all others
  if (updateData.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, updateData);
  await user.save();
  return user;
};

// ── Delete address ───────────────────────────────────────────────
const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  const wasDefault = address.isDefault;
  address.deleteOne();

  // If deleted address was default, make first remaining address the default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return user;
};

// ── Set default address ──────────────────────────────────────────
const setDefaultAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  // Remove default from all, then set on selected
  user.addresses.forEach((addr) => (addr.isDefault = false));
  address.isDefault = true;

  await user.save();
  return user;
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};