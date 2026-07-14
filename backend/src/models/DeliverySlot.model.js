const mongoose = require("mongoose");

const deliverySlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, 
      required: true,
    },
    startTime: {
      type: String, 
      required: true,
    },
    endTime: {
      type: String, 
      required: true,
    },
    label: {
      type: String, 
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