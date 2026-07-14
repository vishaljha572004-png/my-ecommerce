const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const User = require("../../models/User.model");
const AppError = require("../../common/errors/AppError");
const cartService = require("../cart/cart.service");
const paginate = require("../../common/utils/paginate");
const { addOrderJob } = require("../../queues/order.queue");
const { addNotificationJob } = require("../../queues/notification.queue");
const { addInventoryCheckJob } = require("../../queues/inventory.queue");


const createOrder = async (userId, { items: payloadItems, addressId, deliveryAddress, paymentMethod, deliverySlot, notes }) => {
  
  if (!payloadItems || payloadItems.length === 0) {
    throw new AppError("Cart is empty", 400);
  }
  
  
  const rawCart = {};
  payloadItems.forEach(item => {
    rawCart[item.product] = item.quantity;
  });

  
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  let finalAddress = deliveryAddress;
  
  if (addressId) {
    const address = user.addresses.id(addressId);
    if (!address) throw new AppError("Address not found", 404);
    finalAddress = {
      street:     address.street,
      city:       address.city,
      state:      address.state,
      postalCode: address.postalCode,
      country:    address.country,
    };
  } else if (!finalAddress || !finalAddress.street) {
    throw new AppError("Delivery address is required", 400);
  }

  
  const productIds = Object.keys(rawCart);
  const products = await Product.find({ _id: { $in: productIds } });

  const items = [];
  let subtotal = 0;

  for (const product of products) {
    const quantity = parseInt(rawCart[product._id.toString()]);

    if (!product.isActive) {
      throw new AppError(`${product.name} is no longer available`, 400);
    }
    if (product.stock < quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const unitPrice = product.discountedPrice || product.price;
    const totalPrice = unitPrice * quantity;

    items.push({
      productId:    product._id,
      productName:  product.name,
      productImage: product.images?.[0] || "",
      quantity,
      unitPrice,
      totalPrice,
    });

    subtotal += totalPrice;
  }

  
  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const totalAmount = subtotal + deliveryCharge;

  
  const order = await Order.create({
    userId,
    items,
    deliveryAddress: {
      street:     finalAddress.street,
      city:       finalAddress.city,
      state:      finalAddress.state,
      postalCode: finalAddress.postalCode,
      country:    finalAddress.country,
    },
    paymentMethod,
    deliverySlot,
    notes,
    subtotal:       Math.round(subtotal * 100) / 100,
    deliveryCharge,
    totalAmount:    Math.round(totalAmount * 100) / 100,
  });

  
  for (const product of products) {
    const quantity = parseInt(rawCart[product._id.toString()]);
    await Product.findByIdAndUpdate(product._id, {
      $inc: { stock: -quantity, soldCount: quantity },
    });

    
    await addInventoryCheckJob(product._id.toString(), 10);
  }

  
  await cartService.clearCart(userId);

  
  await addOrderJob(order._id.toString());
  await addNotificationJob("ORDER_CONFIRMED", user.email, {
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
  });

  return order;
};


const getUserOrders = async (userId, query) => {
  const { skip, limit, meta } = paginate(query);

  const [orders, total] = await Promise.all([
    Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ userId }),
  ]);

  return { orders, pagination: meta(total) };
};


const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId }).lean();
  if (!order) throw new AppError("Order not found", 404);
  return order;
};


const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new AppError("Order not found", 404);

  if (!["pending", "confirmed"].includes(order.status)) {
    throw new AppError("Order cannot be cancelled at this stage", 400);
  }

  order.status = "cancelled";
  await order.save();

  
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  return order;
};


const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true }
  );
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};