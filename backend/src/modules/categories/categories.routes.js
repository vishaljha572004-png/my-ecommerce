const express = require("express");
const router = express.Router();

const categoriesController = require("./categories.controller");
const { authenticate, adminOnly } = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate");
const { createCategorySchema, updateCategorySchema } = require("./categories.validator");
const cacheMiddleware = require("../../cache/cache.middleware");
const { upload } = require("../../config/cloudinary");


router.get("/", cacheMiddleware(3600), categoriesController.getAllCategories);
router.get("/:id", cacheMiddleware(3600), categoriesController.getCategoryById);


router.post("/", authenticate, adminOnly, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), validate(createCategorySchema), categoriesController.createCategory);
router.put("/:id", authenticate, adminOnly, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), validate(updateCategorySchema), categoriesController.updateCategory);
router.delete("/:id", authenticate, adminOnly, categoriesController.deleteCategory);

module.exports = router;