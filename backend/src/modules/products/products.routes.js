const express = require("express");
const router = express.Router();

const productsController = require("./products.controller");
const { authenticate, adminOnly } = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate");
const { createProductSchema, updateProductSchema } = require("./products.validator");
const cacheMiddleware = require("../../cache/cache.middleware");
const { upload } = require("../../config/cloudinary");


router.get("/", productsController.getAllProducts);
router.get("/featured", cacheMiddleware(600), productsController.getFeaturedProducts);
router.get("/:id", productsController.getProductById);


router.post("/",
  authenticate, adminOnly,
  upload.array("images", 5),
  productsController.createProduct
);

router.put("/:id",
  authenticate, adminOnly,
  upload.array("images", 5),
  productsController.updateProduct
);


router.post("/:id/upload-image",
  authenticate, adminOnly,
  upload.array("images", 5),
  productsController.uploadProductImages
);

router.delete("/:id", authenticate, adminOnly, productsController.deleteProduct);

module.exports = router;