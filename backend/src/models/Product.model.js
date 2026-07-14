const mongoose = require("mongoose");


const variantSchema = new mongoose.Schema({
  name:     { type: String, required: true }, 
  price:    { type: Number, required: true },
  stock:    { type: Number, default: 0 },
  sku:      { type: String, trim: true },
}, { _id: true });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    unit: {
      type: String,
      default: "piece", 
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountedPrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: [{ type: String }],
    tags: [{ type: String, trim: true }],
    variants: [variantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


productSchema.index({ name: "text", description: "text", brand: "text", tags: "text" });
productSchema.index({ categoryId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;