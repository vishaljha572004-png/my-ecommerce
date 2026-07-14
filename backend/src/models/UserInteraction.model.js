const mongoose = require("mongoose");

const userInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["view", "cart", "search", "purchase", "wishlist"],
      required: true,
    },
    score: {
      type: Number,
      default: 1, // e.g., view=1, cart=3, purchase=5
    }
  },
  { timestamps: true }
);

// We keep a history to analyze recency. 
// Index for quick queries
userInteractionSchema.index({ userId: 1, productId: 1, type: 1 });
userInteractionSchema.index({ createdAt: -1 });

const UserInteraction = mongoose.model("UserInteraction", userInteractionSchema);
module.exports = UserInteraction;
