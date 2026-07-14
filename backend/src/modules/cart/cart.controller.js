const cartService = require("./cart.service");


const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.status(200).json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
};


const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, productId, quantity);
    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};


const updateCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(
      req.user._id,
      req.params.productId,
      req.body.quantity
    );
    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};


const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(
      req.user._id,
      req.params.productId
    );
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};


const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };