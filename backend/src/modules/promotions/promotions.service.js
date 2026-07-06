const Coupon = require("../../models/Coupon.model");
const AppError = require("../../common/errors/AppError");
const cacheService = require("../../cache/cache.service");
const KEYS = require("../../cache/cache.keys");

// ── Validate coupon ──────────────────────────────────────────────
const validateCoupon = async (code, orderAmount) => {
  const cacheKey = KEYS.COUPON(code);

  let coupon = await cacheService.get(cacheKey);

  if (!coupon) {
    coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();
    if (coupon) {
      await cacheService.set(cacheKey, coupon, 300);
    }
  }

  if (!coupon) throw new AppError("Invalid coupon code", 404);
  if (!coupon.isActive) throw new AppError("Coupon is not active", 400);
  if (new Date(coupon.expiresAt) < new Date()) {
    throw new AppError("Coupon has expired", 400);
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached", 400);
  }
  if (orderAmount < coupon.minOrderAmount) {
    throw new AppError(
      `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      400
    );
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, orderAmount);

  return {
    coupon,
    discount: Math.round(discount * 100) / 100,
    finalAmount: Math.round((orderAmount - discount) * 100) / 100,
  };
};

// ── Apply coupon (increment usage) ──────────────────────────────
const applyCoupon = async (code) => {
  await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } }
  );
  await cacheService.del(KEYS.COUPON(code));
};

// ── Admin: Create coupon ─────────────────────────────────────────
const createCoupon = async (data) => {
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existing) throw new AppError("Coupon code already exists", 409);
  return Coupon.create({ ...data, code: data.code.toUpperCase() });
};

// ── Admin: Get all coupons ───────────────────────────────────────
const getAllCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 }).lean();
};

// ── Admin: Toggle coupon active status ───────────────────────────
const toggleCoupon = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new AppError("Coupon not found", 404);

  coupon.isActive = !coupon.isActive;
  await coupon.save();
  await cacheService.del(KEYS.COUPON(coupon.code));

  return coupon;
};

module.exports = {
  validateCoupon,
  applyCoupon,
  createCoupon,
  getAllCoupons,
  toggleCoupon,
};