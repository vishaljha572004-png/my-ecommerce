const searchService = require("./search.service");
const AppError = require("../../common/errors/AppError");

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      throw new AppError("Search query must be at least 2 characters", 400);
    }

    const { products, pagination } = await searchService.searchProducts(
      q.trim(),
      req.query
    );

    res.status(200).json({ success: true, data: { products, pagination } });
  } catch (err) {
    next(err);
  }
};

module.exports = { search };