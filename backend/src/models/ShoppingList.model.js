const mongoose = require("mongoose");

const shoppingListItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
});

const shoppingListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [shoppingListItemSchema]
  },
  { timestamps: true }
);

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);
module.exports = ShoppingList;
