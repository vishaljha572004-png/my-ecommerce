const Payment = require("../../models/Payment.model");
const Order = require("../../models/Order.model");
const AppError = require("../../common/errors/AppError");

// ── Initiate payment ─────────────────────────────────────────────
const initiatePayment = async (userId, orderId, method) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new AppError("Order not found", 404);

  if (order.paymentStatus === "paid") {
    throw new AppError("Order is already paid", 400);
  }

  // Create payment record
  const payment = await Payment.create({
    orderId,
    userId,
    amount: order.totalAmount,
    method,
    status: method === "cod" ? "pending" : "pending",
  });

  // If COD — mark order as confirmed directly
  if (method === "cod") {
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        status: "confirmed",
        paymentStatus: "pending", // COD paid on delivery
        paymentMethod: "cod",
      },
    });

    return {
      payment,
      message: "Order confirmed with Cash on Delivery",
    };
  }

  // For online payment — return payment details
  // (Razorpay/Stripe integration goes here in production)
  return {
    payment,
    message: "Proceed with online payment",
    // razorpayOrderId: razorpayOrder.id  ← add when integrating gateway
  };
};

// ── Verify payment (webhook / manual) ───────────────────────────
const verifyPayment = async (paymentId, transactionId, gatewayResponse) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  payment.status = "paid";
  payment.transactionId = transactionId;
  payment.gatewayResponse = gatewayResponse || {};
  payment.paidAt = new Date();
  await payment.save();

  // Update order payment status
  await Order.findByIdAndUpdate(payment.orderId, {
    $set: {
      paymentStatus: "paid",
      status: "confirmed",
    },
  });

  return payment;
};

// ── Get payment by order ─────────────────────────────────────────
const getPaymentByOrder = async (orderId, userId) => {
  const payment = await Payment.findOne({ orderId, userId }).lean();
  if (!payment) throw new AppError("Payment not found", 404);
  return payment;
};

module.exports = { initiatePayment, verifyPayment, getPaymentByOrder };