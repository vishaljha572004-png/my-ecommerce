const express = require("express");
const router = express.Router();

const usersController = require("./users.controller");
const { authenticate } = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate");
const {
  updateProfileSchema,
  addAddressSchema,
  updateAddressSchema,
} = require("./users.validator");

// All user routes require authentication
router.use(authenticate);

// Profile routes
router.get("/me", usersController.getMe);
router.put("/me", validate(updateProfileSchema), usersController.updateMe);

// Address routes
router.post("/addresses", validate(addAddressSchema), usersController.addAddress);
router.put("/addresses/:id", validate(updateAddressSchema), usersController.updateAddress);
router.delete("/addresses/:id", usersController.deleteAddress);
router.put("/addresses/:id/default", usersController.setDefaultAddress);

module.exports = router;