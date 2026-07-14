const express = require("express");
const router = express.Router();

const deliveryController = require("./delivery.controller");
const { authenticate, adminOnly } = require("../auth/auth.middleware");


router.get("/slots", deliveryController.getAvailableSlots);


router.post("/slots/:slotId/lock", authenticate, deliveryController.lockSlot);
router.post("/slots/:slotId/confirm", authenticate, deliveryController.confirmSlot);
router.delete("/slots/:slotId/release", authenticate, deliveryController.releaseSlot);


router.post("/slots/create", authenticate, adminOnly, deliveryController.createSlot);
router.get("/slots/all", authenticate, adminOnly, deliveryController.getAllSlots);

module.exports = router;