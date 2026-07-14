const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId:    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName:  { type: String, required: true },
  productImage: { type: String, default: "" },
  quantity:     { type: Number, required: true, min: 1 },
  unitPrice:    { type: Number, required: true },
  totalPrice:   { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    deliveryAddress: {
      street:     { type: String, required: true },
      city:       { type: String, required: true },
      state:      { type: String, required: true },
      postalCode: { type: String, required: true },
      country:    { type: String, default: "India" },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online", "card", "upi"],
      default: "cod",
    },
    subtotal:       { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount:       { type: Number, default: 0 },
    totalAmount:    { type: Number, required: true },
    deliverySlot:   { type: String, default: "" },
    notes:          { type: String, default: "" },
  },
  { timestamps: true }
);


orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;