const express = require("express");
const router = express.Router();

const inventoryService = require("./inventory.service");
const { authenticate, adminOnly } = require("../auth/auth.middleware");
const AppError = require("../../common/errors/AppError");

// GET /api/inventory/low-stock
router.get("/low-stock", authenticate, adminOnly, async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    const products = await inventoryService.getLowStockProducts(threshold);
    res.status(200).json({ success: true, data: { products } });
  } catch (err) {
    next(err);
  }
});

// GET /api/inventory/:productId
router.get("/:productId", authenticate, adminOnly, async (req, res, next) => {
  try {
    const product = await inventoryService.getStock(req.params.productId);
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
});

// PUT /api/inventory/:productId
router.put("/:productId", authenticate, adminOnly, async (req, res, next) => {
  try {
    const { quantity, operation } = req.body;
    if (quantity === undefined) {
      return next(new AppError("Quantity is required", 400));
    }

    let product;
    if (operation === "increment") {
      product = await inventoryService.incrementStock(req.params.productId, quantity);
    } else {
      product = await inventoryService.updateStock(req.params.productId, quantity);
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: { product },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;