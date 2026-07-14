const mongoose = require("mongoose");

const personalizedOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null }, // for percentage
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // If null, open to eligible users based on rules
    eligibleCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    ruleType: { type: String, enum: ["frequent_buyer", "inactive_user", "cart_abandonment", "general"], default: "general" },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

const PersonalizedOffer = mongoose.model("PersonalizedOffer", personalizedOfferSchema);
module.exports = PersonalizedOffer;
