const deliveryService = require("./delivery.service");

const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required (format: YYYY-MM-DD)",
      });
    }
    const slots = await deliveryService.getAvailableSlots(date);
    res.status(200).json({ success: true, data: { slots } });
  } catch (err) {
    next(err);
  }
};

const lockSlot = async (req, res, next) => {
  try {
    const result = await deliveryService.lockSlot(
      req.params.slotId,
      req.user._id
    );
    res.status(200).json({
      success: true,
      message: "Slot locked for 10 minutes",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const confirmSlot = async (req, res, next) => {
  try {
    const slot = await deliveryService.confirmSlot(req.params.slotId);
    res.status(200).json({
      success: true,
      message: "Slot confirmed",
      data: { slot },
    });
  } catch (err) {
    next(err);
  }
};

const releaseSlot = async (req, res, next) => {
  try {
    const result = await deliveryService.releaseSlot(req.params.slotId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const createSlot = async (req, res, next) => {
  try {
    const slot = await deliveryService.createSlot(req.body);
    res.status(201).json({
      success: true,
      message: "Delivery slot created",
      data: { slot },
    });
  } catch (err) {
    next(err);
  }
};

const getAllSlots = async (req, res, next) => {
  try {
    const slots = await deliveryService.getAllSlots(req.query.date);
    res.status(200).json({ success: true, data: { slots } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAvailableSlots,
  lockSlot,
  confirmSlot,
  releaseSlot,
  createSlot,
  getAllSlots,
};