const Payment = require("../../models/Payment.model");
const Order = require("../../models/Order.model");
const AppError = require("../../common/errors/AppError");


const initiatePayment = async (userId, orderId, method) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new AppError("Order not found", 404);

  if (order.paymentStatus === "paid") {
    throw new AppError("Order is already paid", 400);
  }

  
  const payment = await Payment.create({
    orderId,
    userId,
    amount: order.totalAmount,
    method,
    status: method === "cod" ? "pending" : "pending",
  });

  
  if (method === "cod") {
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        status: "confirmed",
        paymentStatus: "pending", 
        paymentMethod: "cod",
      },
    });

    return {
      payment,
      message: "Order confirmed with Cash on Delivery",
    };
  }

  
  
  return {
    payment,
    message: "Proceed with online payment",
    
  };
};


const verifyPayment = async (paymentId, transactionId, gatewayResponse) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  payment.status = "paid";
  payment.transactionId = transactionId;
  payment.gatewayResponse = gatewayResponse || {};
  payment.paidAt = new Date();
  await payment.save();

  
  await Order.findByIdAndUpdate(payment.orderId, {
    $set: {
      paymentStatus: "paid",
      status: "confirmed",
    },
  });

  return payment;
};


const getPaymentByOrder = async (orderId, userId) => {
  const payment = await Payment.findOne({ orderId, userId }).lean();
  if (!payment) throw new AppError("Payment not found", 404);
  return payment;
};

module.exports = { initiatePayment, verifyPayment, getPaymentByOrder };