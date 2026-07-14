const DeliverySlot = require("../../models/DeliverySlot.model");
const AppError = require("../../common/errors/AppError");
const { cacheClient } = require("../../config/redis");
const KEYS = require("../../cache/cache.keys");


const getAvailableSlots = async (date) => {
  const slots = await DeliverySlot.find({
    date,
    isActive: true,
  }).lean();

  return slots.map((slot) => ({
    ...slot,
    availableCount: slot.maxOrders - slot.bookedCount,
    isFull: slot.bookedCount >= slot.maxOrders,
  }));
};


const lockSlot = async (slotId, userId) => {
  const slot = await DeliverySlot.findById(slotId);
  if (!slot) throw new AppError("Delivery slot not found", 404);
  if (!slot.isActive) throw new AppError("Slot is not available", 400);
  if (slot.bookedCount >= slot.maxOrders) {
    throw new AppError("Slot is fully booked", 400);
  }

  
  const lockKey = KEYS.SLOT_LOCK(slotId);
  const lock = await cacheClient.set(lockKey, userId.toString(), "EX", 600, "NX");

  if (!lock) {
    throw new AppError("Slot is being booked by someone else, please try another slot", 400);
  }

  return { slotId, locked: true, expiresIn: 600 };
};


const confirmSlot = async (slotId) => {
  const slot = await DeliverySlot.findByIdAndUpdate(
    slotId,
    { $inc: { bookedCount: 1 } },
    { new: true }
  );
  if (!slot) throw new AppError("Slot not found", 404);

  
  await cacheClient.del(KEYS.SLOT_LOCK(slotId));

  return slot;
};


const releaseSlot = async (slotId) => {
  await cacheClient.del(KEYS.SLOT_LOCK(slotId));
  return { released: true };
};


const createSlot = async (data) => {
  const slot = await DeliverySlot.create(data);
  return slot;
};


const getAllSlots = async (date) => {
  const filter = date ? { date } : {};
  return DeliverySlot.find(filter).sort({ date: 1, startTime: 1 }).lean();
};

module.exports = {
  getAvailableSlots,
  lockSlot,
  confirmSlot,
  releaseSlot,
  createSlot,
  getAllSlots,
};