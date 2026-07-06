const promotionsService = require("./promotions.service");

const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await promotionsService.validateCoupon(code, orderAmount);
    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await promotionsService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: { coupon },
    });
  } catch (err) {
    next(err);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await promotionsService.getAllCoupons();
    res.status(200).json({ success: true, data: { coupons } });
  } catch (err) {
    next(err);
  }
};

const toggleCoupon = async (req, res, next) => {
  try {
    const coupon = await promotionsService.toggleCoupon(req.params.id);
    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}`,
      data: { coupon },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { validateCoupon, createCoupon, getAllCoupons, toggleCoupon };