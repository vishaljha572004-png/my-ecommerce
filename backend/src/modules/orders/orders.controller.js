const ordersService = require("./orders.service");

const createOrder = async (req, res, next) => {
  try {
    const order = await ordersService.createOrder(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { orders, pagination } = await ordersService.getUserOrders(
      req.user._id,
      req.query
    );
    res.status(200).json({ success: true, data: { orders, pagination } });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await ordersService.getOrderById(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await ordersService.cancelOrder(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await ordersService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    
    const io = require('../../../socket').getIo();
    io.to(`order_${order._id}`).emit('order_status_update', {
      orderId: order._id,
      status: order.status,
      updatedAt: new Date()
    });
    
    
    if (order.userId) {
      io.to(order.userId.toString()).emit('notification', {
        title: 'Order Update',
        message: `Your order #${order._id.toString().slice(-8)} is now ${order.status}`,
        orderId: order._id
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};