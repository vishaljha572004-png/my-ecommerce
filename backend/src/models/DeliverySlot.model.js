const mongoose = require("mongoose");

const deliverySlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // "2026-06-01"
      required: true,
    },
    startTime: {
      type: String, // "09:00"
      required: true,
    },
    endTime: {
      type: String, // "11:00"
      required: true,
    },
    label: {
      type: String, // "9AM - 11AM"
      required: true,
    },
    maxOrders: {
      type: Number,
      default: 20,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

deliverySlotSchema.index({ date: 1, isActive: 1 });

const DeliverySlot = mongoose.model("DeliverySlot", deliverySlotSchema);
module.exports = DeliverySlot;