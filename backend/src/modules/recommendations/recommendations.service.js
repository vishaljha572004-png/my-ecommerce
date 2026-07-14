const UserInteraction = require('../../models/UserInteraction.model');
const Product = require('../../models/Product.model');
const Order = require('../../models/Order.model');

class RecommendationService {
  
  // Log a user interaction
  async logInteraction(userId, productId, type) {
    if (!userId || !productId) return;

    let score = 1;
    if (type === 'view') score = 1;
    if (type === 'cart') score = 3;
    if (type === 'purchase') score = 5;

    // Optional: We can aggregate identical recent interactions, but storing individually allows recency decay.
    await UserInteraction.create({ userId, productId, type, score });
  }

  // Get personalized recommendations for a user
  async getPersonalizedRecommendations(userId) {
    // 1. Get recent user interactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const interactions = await UserInteraction.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (!interactions.length) {
      // Fallback: Best sellers or highly rated
      return this.getFallbackRecommendations();
    }

    // 2. Score products based on interaction type
    const productScores = {};
    const interactedProductIds = new Set();

    interactions.forEach(int => {
      const pId = int.productId.toString();
      interactedProductIds.add(pId);
      if (!productScores[pId]) productScores[pId] = 0;
      productScores[pId] += int.score;
    });

    // We want to recommend products the user hasn't bought recently, but belong to categories they like, 
    // OR just return their highly interacted products that they haven't bought yet.
    // For simplicity, let's get products they interacted with the most.
    
    // Sort by score
    const topScored = Object.entries(productScores)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 10);

    // Fetch the actual product details
    const recommendedProducts = await Product.find({ _id: { $in: topScored }, isActive: true });

    // If we don't have enough (e.g. they only viewed 1 item), backfill with fallbacks
    if (recommendedProducts.length < 5) {
      const fallbacks = await this.getFallbackRecommendations(5 - recommendedProducts.length);
      
      fallbacks.forEach(f => {
        if (!interactedProductIds.has(f._id.toString())) {
          recommendedProducts.push(f);
        }
      });
    }

    return recommendedProducts;
  }

  async getFallbackRecommendations(limit = 10) {
    // Fallback logic: return popular/random active products
    return await Product.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } } // Random for now, can be replaced by top sales
    ]);
  }

  // Frequently Bought Together (Item-based collaborative filtering proxy)
  async getFrequentlyBoughtTogether(productId) {
    // Find orders containing this product
    const orders = await Order.find({ "items.productId": productId })
                              .select("items.productId")
                              .limit(50);
    
    if (!orders.length) {
      // Fallback to same category
      const product = await Product.findById(productId);
      if (!product) return [];
      return await Product.find({ category: product.category, _id: { $ne: productId }, isActive: true }).limit(5);
    }

    // Count other products in these orders
    const coOccurrences = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.productId.toString();
        if (id !== productId.toString()) {
          coOccurrences[id] = (coOccurrences[id] || 0) + 1;
        }
      });
    });

    const topCoOccurring = Object.entries(coOccurrences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    if (!topCoOccurring.length) return [];

    return await Product.find({ _id: { $in: topCoOccurring }, isActive: true });
  }

  // Similar Products (Content-based)
  async getSimilarProducts(productId) {
    const product = await Product.findById(productId);
    if (!product) return [];

    return await Product.find({
      category: product.category,
      _id: { $ne: productId },
      isActive: true
    }).limit(5);
  }
}

module.exports = new RecommendationService();
