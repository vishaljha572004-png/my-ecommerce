const productsService = require("./products.service");

const getAllProducts = async (req, res, next) => {
  try {
    const { products, pagination } = await productsService.getAllProducts(req.query);
    res.status(200).json({ success: true, data: { products, pagination } });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productsService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];
    const product = await productsService.createProduct({
      ...req.body,
      images: imageUrls,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];
    const updateData = { ...req.body };
    if (imageUrls.length > 0) updateData.images = imageUrls;

    const product = await productsService.updateProduct(req.params.id, updateData);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};

const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const imageUrls = req.files.map((f) => f.path);
    const product = await productsService.updateProduct(req.params.id, {
      images: imageUrls,
    });

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: { product, imageUrls },
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productsService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await productsService.getFeaturedProducts();
    res.status(200).json({ success: true, data: { products } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  uploadProductImages,
};