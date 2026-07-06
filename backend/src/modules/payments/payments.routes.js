const express = require("express");
const router = express.Router();

const paymentsController = require("./payments.controller");
const { authenticate } = require("../auth/auth.middleware");

router.use(authenticate);

router.post("/initiate", paymentsController.initiatePayment);
router.post("/verify", paymentsController.verifyPayment);
router.get("/order/:orderId", paymentsController.getPaymentByOrder);

module.exports = router;