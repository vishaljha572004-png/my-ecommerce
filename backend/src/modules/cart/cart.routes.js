const express = require("express");
const router = express.Router();

const cartController = require("./cart.controller");
const { authenticate } = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate");
const { addToCartSchema, updateCartSchema } = require("./cart.validator");

// All cart routes require authentication
router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/add", validate(addToCartSchema), cartController.addToCart);
router.put("/update/:productId", validate(updateCartSchema), cartController.updateCartItem);
router.delete("/remove/:productId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;