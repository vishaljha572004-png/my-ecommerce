const categoriesService = require("./categories.service");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getAllCategories();
    res.status(200).json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoriesService.getCategoryById(req.params.id);
    res.status(200).json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.files) {
      if (req.files.image && req.files.image[0]) payload.image = req.files.image[0].path;
      if (req.files.banner && req.files.banner[0]) payload.banner = req.files.banner[0].path;
    }
    const category = await categoriesService.createCategory(payload);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.files) {
      if (req.files.image && req.files.image[0]) payload.image = req.files.image[0].path;
      if (req.files.banner && req.files.banner[0]) payload.banner = req.files.banner[0].path;
    }
    const category = await categoriesService.updateCategory(req.params.id, payload);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoriesService.deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};