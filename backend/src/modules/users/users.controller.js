const usersService = require("./users.service");


const getMe = async (req, res, next) => {
  try {
    const user = await usersService.getProfile(req.user._id);
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};


const updateMe = async (req, res, next) => {
  try {
    const user = await usersService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};


const addAddress = async (req, res, next) => {
  try {
    const user = await usersService.addAddress(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: { addresses: user.addresses },
    });
  } catch (err) {
    next(err);
  }
};


const updateAddress = async (req, res, next) => {
  try {
    const user = await usersService.updateAddress(
      req.user._id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: { addresses: user.addresses },
    });
  } catch (err) {
    next(err);
  }
};


const deleteAddress = async (req, res, next) => {
  try {
    const user = await usersService.deleteAddress(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: { addresses: user.addresses },
    });
  } catch (err) {
    next(err);
  }
};


const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await usersService.setDefaultAddress(
      req.user._id,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: { addresses: user.addresses },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};