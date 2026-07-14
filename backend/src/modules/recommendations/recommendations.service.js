const UserInteraction = require('../../models/UserInteraction.model');
const Product = require('../../models/Product.model');
const Order = require('../../models/Order.model');

class RecommendationService {
  
  
  async logInteraction(userId, productId, type) {
    if (!userId || !productId) return;

    let score = 1;
    if (type === 'view') score = 1;
    if (type === 'cart') score = 3;
    if (type === 'purchase') score = 5;

    
    await UserInteraction.create({ userId, productId, type, score });
  }

  
  async getPersonalizedRecommendations(userId) {
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const interactions = await UserInteraction.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (!interactions.length) {
      
      return this.getFallbackRecommendations();
    }

    
    const productScores = {};
    const interactedProductIds = new Set();

    interactions.forEach(int => {
      const pId = int.productId.toString();
      interactedProductIds.add(pId);
      if (!productScores[pId]) productScores[pId] = 0;
      productScores[pId] += int.score;
    });

    
    
    
    
    
    const topScored = Object.entries(productScores)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 10);

    
    const recommendedProducts = await Product.find({ _id: { $in: topScored }, isActive: true });

    
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
    
    return await Product.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } } 
    ]);
  }

  
  async getFrequentlyBoughtTogether(productId) {
    
    const orders = await Order.find({ "items.productId": productId })
                              .select("items.productId")
                              .limit(50);
    
    if (!orders.length) {
      
      const product = await Product.findById(productId);
      if (!product) return [];
      return await Product.find({ category: product.category, _id: { $ne: productId }, isActive: true }).limit(5);
    }

    
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
