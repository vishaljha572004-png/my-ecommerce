const Product = require("../../models/Product.model");
const cacheService = require("../../cache/cache.service");
const KEYS = require("../../cache/cache.keys");
const { env } = require("../../config");
const paginate = require("../../common/utils/paginate");


const searchProducts = async (query, queryParams) => {
  const cacheKey = KEYS.SEARCH_RESULTS(
    `${query}-${JSON.stringify(queryParams)}`
  );

  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const { skip, limit, meta } = paginate(queryParams);

      const filter = {
        isActive: true,
        $text: { $search: query },
      };

      const [products, total] = await Promise.all([
        Product.find(filter, { score: { $meta: "textScore" } })
          .populate("categoryId", "name")
          .sort({ score: { $meta: "textScore" } })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      return { products, pagination: meta(total) };
    },
    env.CACHE_TTL_SEARCH
  );
};

module.exports = { searchProducts };