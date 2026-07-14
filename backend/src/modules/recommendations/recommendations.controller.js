const recommendationService = require('./recommendations.service');
const { ErrorResponse } = require('../../common/errors/errorHandler');

exports.getPersonalized = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.getPersonalizedRecommendations(req.user.id);
    res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
};

exports.getFrequentlyBoughtTogether = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const recommendations = await recommendationService.getFrequentlyBoughtTogether(productId);
    res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
};

exports.getSimilar = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const recommendations = await recommendationService.getSimilarProducts(productId);
    res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
};

exports.logInteraction = async (req, res, next) => {
  try {
    const { productId, type } = req.body;
    if (!productId || !type) {
      return next(new ErrorResponse("productId and type are required", 400));
    }
    
    // Only log if user is authenticated (using optional auth middleware in route)
    if (req.user) {
      await recommendationService.logInteraction(req.user.id, productId, type);
    }
    
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
