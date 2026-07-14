const User = require("../../models/User.model");
const AppError = require("../../common/errors/AppError");


const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
};


const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,        
      runValidators: true,
    }
  );
  if (!user) throw new AppError("User not found", 404);
  return user;
};


const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  
  
  if (addressData.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();
  return user;
};


const updateAddress = async (userId, addressId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  
  if (updateData.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, updateData);
  await user.save();
  return user;
};


const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  const wasDefault = address.isDefault;
  address.deleteOne();

  
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return user;
};


const setDefaultAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const address = user.addresses.id(addressId);
  if (!address) throw new AppError("Address not found", 404);

  
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