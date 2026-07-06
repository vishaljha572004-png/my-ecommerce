const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const User = require("../../models/User.model");
const AppError = require("../../common/errors/AppError");
const cartService = require("../cart/cart.service");
const paginate = require("../../common/utils/paginate");
const { addOrderJob } = require("../../queues/order.queue");
const { addNotificationJob } = require("../../queues/notification.queue");
const { addInventoryCheckJob } = require("../../queues/inventory.queue");

// ── Create order from cart ───────────────────────────────────────
const createOrder = async (userId, { items: payloadItems, addressId, deliveryAddress, paymentMethod, deliverySlot, notes }) => {
  // 1. Get cart from payload
  if (!payloadItems || payloadItems.length === 0) {
    throw new AppError("Cart is empty", 400);
  }
  
  // Create a rawCart map to preserve existing logic
  const rawCart = {};
  payloadItems.forEach(item => {
    rawCart[item.product] = item.quantity;
  });

  // 2. Get user address
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

  // 3. Build order items + validate stock
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

  // 4. Calculate charges
  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const totalAmount = subtotal + deliveryCharge;

  // 5. Create order
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

  // 6. Deduct stock
  for (const product of products) {
    const quantity = parseInt(rawCart[product._id.toString()]);
    await Product.findByIdAndUpdate(product._id, {
      $inc: { stock: -quantity, soldCount: quantity },
    });

    // Add inventory check job for low stock alert
    await addInventoryCheckJob(product._id.toString(), 10);
  }

  // 7. Clear cart
  await cartService.clearCart(userId);

  // 8. Add jobs to queues
  await addOrderJob(order._id.toString());
  await addNotificationJob("ORDER_CONFIRMED", user.email, {
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
  });

  return order;
};

// ── Get user orders ──────────────────────────────────────────────
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

// ── Get single order ─────────────────────────────────────────────
const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId }).lean();
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

// ── Cancel order ─────────────────────────────────────────────────
const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new AppError("Order not found", 404);

  if (!["pending", "confirmed"].includes(order.status)) {
    throw new AppError("Order cannot be cancelled at this stage", 400);
  }

  order.status = "cancelled";
  await order.save();

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  return order;
};

// ── Admin: update order status ───────────────────────────────────
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