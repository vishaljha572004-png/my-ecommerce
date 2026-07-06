const paymentsService = require("./payments.service");

const initiatePayment = async (req, res, next) => {
  try {
    const { orderId, method } = req.body;
    const result = await paymentsService.initiatePayment(
      req.user._id,
      orderId,
      method
    );
    res.status(200).json({
      success: true,
      message: result.message,
      data: { payment: result.payment },
    });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, transactionId, gatewayResponse } = req.body;
    const payment = await paymentsService.verifyPayment(
      paymentId,
      transactionId,
      gatewayResponse
    );
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { payment },
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await paymentsService.getPaymentByOrder(
      req.params.orderId,
      req.user._id
    );
    res.status(200).json({ success: true, data: { payment } });
  } catch (err) {
    next(err);
  }
};

module.exports = { initiatePayment, verifyPayment, getPaymentByOrder };